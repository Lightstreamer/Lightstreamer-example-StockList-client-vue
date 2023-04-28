<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="width: 1060px; height: 300px; --ag-font-size: 9px;"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    animateRows="true"
    :getRowId="getRowId"
    @grid-ready="onGridReady"
  >
  </ag-grid-vue>
 </template>

<script>
import { AgGridVue } from "ag-grid-vue3";  // the AG Grid Vue Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { LightstreamerClient, Subscription, ConsoleLogLevel, ConsoleLoggerProvider, ItemUpdate, StatusWidget } from 'lightstreamer-client-web/lightstreamer.esm';

class LsClient {
  itemNames = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10'];
  fieldNames = ['stock_name', 'last_price', 'time', 'pct_change', 'bid_quantity', 'bid', 'ask', 'ask_quantity', 'min', 'max', 'ref_price', 'open_price'];

  constructor() {
    LightstreamerClient.setLoggerProvider(new ConsoleLoggerProvider(ConsoleLogLevel.WARN));
    // creates a subscription
    var sub = new Subscription('MERGE', this.itemNames, this.fieldNames);
    sub.setDataAdapter('QUOTE_ADAPTER');
    sub.addListener(this);
    // subscribes to the stock items
    this.client = new LightstreamerClient((document.location.protocol === 'https:' ? 'https' : 'http') + '://push.lightstreamer.com', 'DEMO');
    this.client.subscribe(sub);
    // registers the StatusWidget
    this.client.addListener(new StatusWidget('left', '0px', true));
  }

  connect(gridApi/*: GridApi<StockItem>*/) {
    this.gridApi = gridApi;
    this.client.connect();  
  }

  // callback for SubscriptionListener.onItemUpdate event
  onItemUpdate(update/*: ItemUpdate*/) {
    var item = this.getStockItem(update);
    var row = this.gridApi.getRowNode(item.stock_name);
    if (row) {
      this.gridApi.applyTransaction({update: [item]})
    } else {
      this.gridApi.applyTransaction({add: [item]});
    }
  }

  getStockItem(update/*: ItemUpdate*/)/*: StockItem*/ {
    var obj = {};
    for (var f of this.fieldNames) {
      var val = update.getValue(f);
      if (f === 'stock_name' || f === 'time') {
        obj[f] = val;
      } else {
        obj[f] = parseFloat(val);
      }
    }
    return obj;
  }
}

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  setup() {
    // Each Column Definition results in one Column.
    const columnDefs = [
      { headerName: 'Name', field: 'stock_name', width: 130 },
      { headerName: 'Last', field: 'last_price', width: 80 },
      { headerName: 'Time', field: 'time', width: 90 },
      { headerName: 'Change', field: 'pct_change', width: 90 },
      { headerName: 'Bid Size', field: 'bid_quantity', width: 90 },
      { headerName: 'Bid', field: 'bid', width: 70 },
      { headerName: 'Ask', field: 'ask', width: 70 },
      { headerName: 'Ask Size', field: 'ask_quantity', width: 100 },
      { headerName: 'Min', field: 'min', width: 80 },
      { headerName: 'Max', field: 'max', width: 80 },
      { headerName: 'Ref.', field: 'ref_price', width: 80 },
      { headerName: 'Open', field: 'open_price', width: 80 },
    ];

    // DefaultColDef sets props common to all Columns
    const defaultColDef = {
      sortable: true,
      filter: true,
      enableCellChangeFlash: true,
      resizable: true,
    };

    // Callback that tells the grid to use the 'stock_name' attribute for IDs
    const getRowId = (params) => params.data.stock_name;
    
    const client = new LsClient();
    
    // Obtain API from grid's onGridReady event
    const onGridReady = (params) => {
      client.connect(params.api);
    };

    return {
      columnDefs,
      defaultColDef,
      getRowId,
      onGridReady,
    };
  },
};
</script>

<style lang="scss"></style>
