// @ts-nocheck //
import AdminJS, {
  ActionContext,
  ActionRequest,
  NoticeMessage,
  BulkActionResponse,
} from "adminjs";

const markApproved = {
  actionType: "bulk",
  //   icon: "Publish",
  label: "Approve",
  isBulk: true,
  showInDrawer: true,
  // hideActionHeader: true,
  // guard: "Approve Request(s)?",
  handler: async (
    request: ActionRequest,
    response: any,
    context: ActionContext
  ) => {
    // get the selected records from the request
    const { records, resource, h, currentAdmin } = context;
    if (request.method === "get") {
      const recordsInJSON = records.map((record) =>
        record.toJSON(context.currentAdmin)
      );
      return {
        records: recordsInJSON,
      };
    }
    console.log("updating...");
    console.log(request.query, "what we have in params");
    await Promise.all(
      request.query.ids.map(async (recordId) => {
        const record = await resource.findOne(recordId);
        console.log(record, "record");
        await record.update({ status: "processed" });
      })
    );

    return {
      records: records?.map((record) => record.toJSON(currentAdmin)),
      notice: { message: "Approved!", type: "success" } as NoticeMessage,
      redirectUrl: h.resourceUrl({ resourceId: resource.id() }),
      unselectAll: true,
    } as BulkActionResponse;
  },
  // after: async (request, response, context) => {
  //   const { records, resource, h, currentAdmin } = context;
  //   // refresh the list view
  //   context._admin.redirectUrl = context.h.resourceUrl({
  //     resourceId: context.resource.id(),
  //   });
  //   // unselect all records
  //   context._admin.unselectAllRecords = true;
  //   return {
  //     records: records?.map((record) => record.toJSON(currentAdmin)),
  //   };
  // },
};
export default markApproved;
