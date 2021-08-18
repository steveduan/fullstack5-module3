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
    console.log(this.found);
    var len=list.found.length;
    if(len===0){
      list.errorMsg=true;
    }else{
      list.errorMsg=false;
    }
  };
  list.removeItem = function (itemIndex) {
    console.log("'this' is: ", this);
    console.log("delete index: "+itemIndex);    
    MenuSearchService.removeItem(itemIndex);
    
  };

};

MenuSearchService.$inject=['$http'];
function MenuSearchService($http) {
  var service = this;
  // List of shopping items
  var foundItems=[];
  service.getItems=function(){
    return foundItems;
  };
  service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };
  service.getMatchedMenuItems=function(searchTerm){
    
    return $http(
      {
        method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      }
    ).then(function (result) {
      // process result and only keep items that match
      var items=result.data;
      items=items.menu_items;
      var des="";
      foundItems=[];
      for(var i = 0;i<items.length;i++){
        des=items[i].description;
        if(des.indexOf(searchTerm)!=-1){
          var ele={
            name:items[i].name,
            short_name : items[i].short_name,
            description: items[i].description
          };
          foundItems.push(ele);
        }
      }
      // console.log("what the foundItems ack like:",foundItems);
      // // return processed items
      // return foundItems;
      //we don't want to return foundItems here, this some error
  },function (reject){
    console.log(reject,"some thing wrong!");
  });
  }
};





})();
