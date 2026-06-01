using { SalesOrderService } from '../routes/main';

annotate SalesOrderService.SalesOrdersHeaders with @(
    UI: {
        HeaderInfo: {
            TypeName: 'Sales Order',
            TypeNamePlural: 'Sales Orders',
            Title: {
                $Type: 'UI.DataField',
                Value: id
            }
        },
        SelectionFields: [
            id,
            totalamount,
            customers_id,
            status_id,
        ],
        LineItem: [
            {
                $Type: 'UI.DataField',
                Label: 'ID label',
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%', 
                },
                Value: id,
            },        
            {
                $Type: 'UI.DataField',                
                Value: totalamount,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '10%', 
                },
            },
            {
                $Type: 'UI.DataField',
                Label: 'Data de Criação',
                Value: createdAt,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%', 
                },
            },
            {
                $Type: 'UI.DataField',
                Label: 'Criado por',
                Value: createdBy,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%', 
                },
            },
            {
                $Type: 'UI.DataField',
                Label: 'Cliente',
                Value: customers_id,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%', 
                },
            },
            {
                $Type: 'UI.DataField',
                Label: 'Status',
                Value: status_id,
                Criticality: (status.id = 'COMPLETED' ? 3 : (status.id = 'PENDING' ? 2 : 1 )),
                CriticalityRepresentation: #withoutIcon,
                ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%', 
                },
            },
        ],
        identification: [
            {
                $Type: 'UI.DataField',
                Label: 'ID',
                Value: id
            }
        ],
        Facets: [
            {
                $Type: 'UI.ReferenceFacet',
                Label: 'General',
                Target: '@UI.FieldGroup#General'
            }
        ],
        FieldGroup#General: {
            Data: [
                {
                    $Type: 'UI.DataField',
                    Label: 'ID',
                    Value: id
                },
                {
                    $Type: 'UI.DataField',
                    Label: 'Total Amount',
                    Value: totalamount
                }
            ]
        }
    }   
)
 {
        id @title: 'Ordem ID';
        totalamount @title: 'Total Amount Title';
        customers @(
            title: 'Cliente ID',
            Common: {                
                Label : 'Cliente',               
                TextArrangement: #TextOnly,
                ValueList : {
                    $Type : 'Common.ValueListType',
                    CollectionPath : 'customers',                    
                    Parameters: [
                        {
                        $Type: 'Common.ValueListParameterInOut',
                        ValueListProperty: 'id',
                        LocalDataProperty: 'customer_id',                        
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'firstName',                       
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'email',                       
                    }
                    ]
                }  
            }
            );
            status @(
                title: 'Status',
                Common: {                
                Label : 'status',  
                Text: status.description,             
                TextArrangement: #TextOnly,
                ValueListWithFixedValues,
                ValueList : {
                    $Type : 'Common.ValueListType',
                    CollectionPath : 'SalesOrderStatuses',                    
                    Parameters: [
                        {
                        $Type: 'Common.ValueListParameterInOut',
                        ValueListProperty: 'id',
                        LocalDataProperty: 'status_id',  
                       }
                    ]
                }
            }                                       
        );
    };
    annotate SalesOrderService.SalesOrderStatuses with {
        id @Common.Text: description @Common.TextArrangement: #TextOnly;
    };
    
