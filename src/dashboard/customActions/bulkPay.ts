// @ts-nocheck
import AdminJS, {
  ActionContext,
  ActionRequest,
  NoticeMessage,
  BulkActionResponse,
} from "adminjs";
import { models } from "../../../models";
const BulkPay = {
  actionType: "bulk",
  label: "Pay in bulk",
  showInDrawer: true,
  handler: async (req: ActionRequest, res, data: ActionContext) => {
    if (req.method === "get") {
      const { records } = data;
      const builtData = await Promise.all(
        records?.map(async (record) => {
          const withdrawalRequest = await models.withdrawalRequests.findOne({
            where: {
              id: record.id(),
            },
            include: [
              {
                model: models.users,
                required: true,
              },
              {
                model: models.transactions,
                required: true,
                include: {
                  model: models.packages,
                },
              },
            ],
          });
          if (!withdrawalRequest?.dataValues.user.walletAddress)
            throw new Error("One or more users is missing a wallet address!");
          return {
            _address: withdrawalRequest?.dataValues.user.walletAddress,
            plan: withdrawalRequest.transaction.package.contractIndex,
          };
        })
      );
      return {
        records: records?.map((record, idx) => {
          const json = record.toJSON(data.currentAdmin);
          json.contractPayload = builtData[idx];
          return json;
        }),
      };
      //   console.log(builtData);
    }
  },
};

export default BulkPay;
