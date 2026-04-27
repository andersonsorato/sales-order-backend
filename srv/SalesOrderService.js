const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
  // Mock data store
  const salesOrdersHeaders = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: new Date(),
      modifiedAt: new Date()
    }
  ];

  // READ all records
  srv.on('READ', 'SalesOrdersHeaders', (req) => {
    return salesOrdersHeaders;
  });

  // READ single record
  srv.on('READ', 'SalesOrdersHeaders', (req) => {
    if (req.data.id) {
      return salesOrdersHeaders.find(h => h.id === req.data.id);
    }
    return salesOrdersHeaders;
  });

  // CREATE new record
  srv.on('CREATE', 'SalesOrdersHeaders', (req) => {
    const newRecord = {
      id: req.data.id || generateUUID(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      ...req.data
    };
    salesOrdersHeaders.push(newRecord);
    return newRecord;
  });
});

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
