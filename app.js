(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems', FoundItemsDirective)



function FoundItemsDirective() {
  var ddo = {
    templateUrl: './loader/itemsloaderindicator.template.html',
    scope: {
      items: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller: DirectiveController,
    controllerAs: 'list',
    bindToController: true,                                                                                                
  };

  return ddo;
}

function DirectiveController() {
  var list = this;
}


//  controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  list.searchItem="";
  list.errorMsg=false;
  list.search =function(){
    MenuSearchService.getMatchedMenuItems(list.searchItem);
    list.found=MenuSearchService.getItems();
    var len=list.found.length;
    console.log(len);
    if(len===0){
      list.errorMsg=true;
    }else{
      list.errorMsg=false;
    }
  };
  list.removeItem = function (itemIndex) {
    // console.log("'this' is: ", this);
    // console.log("delete index: "+itemIndex);    
    MenuSearchService.removeItem(itemIndex);
    
  };

};

MenuSearchService.$inject=['$http',"$timeout"];
function MenuSearchService($http,$timeout) {
  var service = this;
  // List of shopping items
  var alreadyGet=0;
  var foundItems=[];
  var dataItems=[];
  service.getItems=function(){
    
    return foundItems;
  };
  service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };
  service.getMatchedMenuItems=function(searchTerm){
    if(alreadyGet===0){
      alreadyGet=1;
         $http(
      {
        method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      }
    ).then(function (result) {
      // process result and only keep items that match
      var items=result.data;
      dataItems=items.menu_items;
     
      
  },function (reject){
    console.log(reject,"something wrong!");
  });

    //$timeout(function(){console.log("wait some second to wait for json load")},2000);

   };

      var des="";
      foundItems=[];
      console.log("search for :",searchTerm);
      if(searchTerm==='')return;
      // console.log("don't get json again!!",dataItems)
      for(var i = 0;i<dataItems.length;i++){
        des=dataItems[i].description;
        if(des.indexOf(searchTerm)!=-1){
          var ele={
            name:dataItems[i].name,
            short_name : dataItems[i].short_name,
            description: dataItems[i].description
          };
          foundItems.push(ele);
        }
      };



};


};





})();
