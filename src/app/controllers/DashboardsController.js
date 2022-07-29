import Order from "../models/Order";

class DashboardsController {
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 5;
      const createdAt = req.query.createdAt;

      const where = {};
      if(createdAt) {
        where.createdAt = {
          $gte: new Date(createdAt)
        }
      }

      const resume = (
        await Order.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$payment.amount" },
              count: { $count: {} },
              sales_total: { $sum: { $cond: [{ $eq: ["$payment.status", "succeeded"] }, "$payment.amount", 0] } },
              sales_count: { $sum: { $cond: [{ $eq: ["$payment.status", "succeeded"] }, 1, 0] } },
              average_ticket: { $avg: "$payment.amount" },
            },
          },
          {
            $project: {
              orders_total: "$total",
              orders_count: "$count",
              sales_total: "$sales_total",
              sales_count: "$sales_count",
              average_ticket: { $ceil: "$average_ticket" },
            },
          },
          { $unset: ["_id"] },
        ])
      )[0];

      const orders = await Order.find(where)
        .skip((page - 1) * perPage)
        .limit(perPage);

      const pagination = {
        has_more: resume.orders_count > orders.length,
        limit: perPage,
        total_pages: Math.ceil(resume.orders_count / perPage),
        page: page,
        total: resume.orders_count,
      };

      const data = {
        ...resume,
        orders,
        ...pagination,
      };

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Ops! Ocorreu um erro em nosso servidor. Por favor, tente novamente ou contate o suporte.",
      });
    }
  }
}
export default new DashboardsController();
