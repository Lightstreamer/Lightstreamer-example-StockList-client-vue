/*
 * LIGHTSTREAMER - www.lightstreamer.com
 * Basic Stock-List Demo
 *
 *  Copyright (c) Lightstreamer Srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fields = ["stock_name", "time", "last_price", "ask", "bid", "bid_quantity", "ask_quantity", "pct_change", "min", "max", "open_price"];

var stocks = [{stock_name: 'Anduct', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'Ations Europe', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'Bagies Consulting', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'BAY Corporation', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'CON Consulting', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'Corcor PLC', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'CVS Asia', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'Datio PLC', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'Dentems', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"},
              {stock_name: 'ELE Manufacturing', last_price: "-", time: "-", pct_change: "-", bid: "-", bid_quantity: "-", min: "-", open_price: "-", ask: "-", ask_quantity: "-", max: "-"}];

var stockNames = stocks.map(function(el) { return el.stock_name });

var lsClient, 
    lsSubscription;

function lsConnect() {
    var protocolToUse = document.location.protocol != "file:" ? document.location.protocol : "https:";
    var portToUse = document.location.protocol == "https:" ? "443" : "8080";

    lsClient = new Lightstreamer.LightstreamerClient(protocolToUse+"//localhost:"+portToUse,"DEMO");

    lsClient.addListener(new Lightstreamer.StatusWidget("left", "0px", true));

    lsClient.addListener({
        onStatusChange: function(newStatus) {         
            console.log(newStatus);
        }
    });

    lsClient.connect();
};

function lsSubscribe () {
    lsSubscription = new Lightstreamer.Subscription("MERGE",["item1","item2","item3","item4","item5","item6","item7","item8","item9","item10"],["stock_name", "time","last_price","ask", "bid","bid_quantity","ask_quantity","pct_change","min","max","ref_price","open_price"]);
    lsSubscription.setDataAdapter("QUOTE_ADAPTER");
    lsSubscription.setRequestedSnapshot("yes");

    lsSubscription.addListener({
        onSubscription: function() {
            console.log("SUBSCRIBED");
        },
        onUnsubscription: function() {
            console.log("UNSUBSCRIBED");
        },
        onItemUpdate: function(obj) {                                       
            var index = stockNames.indexOf(obj.getValue("stock_name"));
            var stock = stocks[index];

            stock.stock_name = obj.getValue("stock_name");
            stock.last_price = obj.getValue("last_price");
            stock.time = obj.getValue("time");
            stock.pct_change = obj.getValue("pct_change");
            stock.ask = obj.getValue("ask");
            stock.ask_quantity = obj.getValue("ask_quantity");
            stock.bid = obj.getValue("bid");
            stock.bid_quantity = obj.getValue("bid_quantity");
            stock.min = obj.getValue("min");
            stock.max = obj.getValue("max");
            stock.open_price = obj.getValue("open_price");
        }
    });

    lsClient.subscribe(lsSubscription);
};

function lsSetup() {
    lsConnect();
    lsSubscribe();
};

// register the custom component
Vue.component('ls-stock-list', {
    template: '#stock-list-template',
    
    props: {
        data: Array,
        columns: Array
    },

    created: function() {
        lsSetup();
    }
});

Vue.filter('ununderscorize', function (value) {
    return value.replace("_", " ");
});

// bootstrap the demo
var demo = new Vue({
    el: '#demo',

    data: {
        gridColumns: fields,
        gridData: stocks
    }
});