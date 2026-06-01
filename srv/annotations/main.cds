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
                $Type: 'UI.CollectionFacet',
                ID: 'salesOrderData',
                Label: 'Informacao do Cabeçalho do Pedido',
                Facets:[
                     {
                        ID: 'header',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#General'
                    }
                ]
            },
            {
                $Type: 'UI.ReferenceFacet',
                ID: 'costumerData',
                Label: 'Informacao do Cliente',
                Target: 'customers/@UI.FieldGroup#CustomerData'
            },
            {
                $Type: 'UI.ReferenceFacet',
                ID: 'ItemsData',
                Label: 'Items do Pedido',
                Target: 'items/@UI.LineItem'
            },
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
        },
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

    annotate SalesOrderService.customers with @(
        UI: {
            FieldGroup#CustomerData : {
                $Type : 'UI.FieldGroupType',
                Data : [
                    {
                        $Type: 'UI.DataField',
                        Label: 'Cliente',
                        Value: id
                    },
                    {
                        $Type: 'UI.DataField',
                        Label: 'Nome',
                        Value: firstName
                    },                   
                    {
                        $Type: 'UI.DataField',
                        Label: 'E-mail',
                        Value: email
                    }
                ]                
            },
        }
    ){
        id @title: 'Customer ID';
        firstName @title: 'Name';        
         email @title: 'E-mail';
};

annotate SalesOrderService.SalesOrderItems with @(
        UI: {
            LineItem: [
                {
                    $Type: 'UI.DataField',
                    Value: id,
                    ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '18%', 
                },
                },        
                {
                    $Type: 'UI.DataField',                
                    Value: price,  
                    ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '10%', 
                },                  
                },
             {
                    $Type: 'UI.DataField',
                    Label: 'Produto',
                    Value: product, 
                    ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '10%', 
                },                   
                },
                 {
                    $Type: 'UI.DataField',
                    Label: 'Quantidade',
                    Value: quantity, 
                    ![@HTML5.CssDefaults] : {
                    $Type : 'HTML5.CssDefaultsType',
                    width : '9%', 
                },                   
                },                
            ],
        }
)
{
    id @title: 'Item ID';
    price @title: 'Preço';    
    quantity @title: 'QTD';
};

annotate SalesOrderService.products with {    
    name @title: 'Produto';
};

    
