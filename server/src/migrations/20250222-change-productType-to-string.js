'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Đối với PostgreSQL, ta có thể sử dụng câu lệnh ALTER TABLE với USING để chuyển đổi giá trị hiện tại sang VARCHAR
    await queryInterface.sequelize.query(`
      ALTER TABLE "products"
      ALTER COLUMN "product_type" TYPE VARCHAR(50)
      USING "product_type"::VARCHAR(50);
    `)
  },

  down: async (queryInterface, Sequelize) => {
    // Để rollback, bạn cần chuyển đổi lại thành ENUM (với các giá trị cũ)
    // Lưu ý: Nếu có dữ liệu không khớp với ENUM ban đầu thì rollback sẽ thất bại.
    await queryInterface.sequelize.query(`
      ALTER TABLE "products"
      ALTER COLUMN "product_type" TYPE "enum_products_productType"
      USING "product_type"::"enum_products_productType";
    `)
  },
}
