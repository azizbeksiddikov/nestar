import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ViewService } from '../view/view.service';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Property } from '../../libs/dto/property/property';
import { Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import moment from 'moment';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		private memberService: MemberService,
		private viewService: ViewService,
	) {}

	public async createProperty(input: PropertyInput): Promise<Property> {
		try {
			const result = await this.propertyModel.create(input);
			await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberProperties', modifier: 1 });

			return result;
		} catch (err) {
			console.log('Error: Service.model:', err.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}

	public async getProperty(memberId: ObjectId | null, propertyId: ObjectId): Promise<Property> {
		const search: T = {
			_id: propertyId,
			propertyStatus: PropertyStatus.ACTIVE,
		};

		const targetProperty: Property | null = await this.propertyModel.findOne(search).lean().exec();
		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput: ViewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
			const newView = await this.viewService.recordView(viewInput);

			if (newView) {
				await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
				targetProperty.propertyViews += 1;
			}

			// meLiked
		}

		targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
		return targetProperty;
	}

	public async propertyStatsEditor(input: StatisticModifier): Promise<Property> {
		const { _id, targetKey, modifier } = input;
		return (await this.propertyModel
			.findByIdAndUpdate({ _id }, { $inc: { [targetKey]: modifier } }, { new: true })
			.exec()) as unknown as Property;
	}

	public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
		// 1. We didnt update the soldAt and deletedAt fields in the database. We need to update them
		// 2. MongoDB error: dupplicate key error
		// 3. "propertyStatus": "SOLD"?  INTERNAL_SERVER_ERROR: "message": "(0 , moment_1.default) is not a function"
		// moment  considered legacy. Use other alternatives
		let { propertyStatus, soldAt, deletedAt } = input;
		console.log('propertyStatus:', propertyStatus);
		console.log('soldAt:', soldAt);
		console.log('deletedAt:', deletedAt);

		const search: T = {
			_id: input._id,
			memberId: memberId,
			propertyStatus: PropertyStatus.ACTIVE,
		};

		// if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
		// else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

		if (propertyStatus === PropertyStatus.SOLD) soldAt = new Date();
		else if (propertyStatus === PropertyStatus.DELETE) deletedAt = new Date();

		const result = await this.propertyModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({ _id: memberId, targetKey: 'memberProperties', modifier: -1 });
		}

		return result;
	}
}
