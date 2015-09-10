( function() {

    var locationcontroller = function($scope,$window, $filter ,$modal,dataFactory,$log , AuthsFactory ) {
    
    $scope.handle = '';
    $scope.myTitle = 'What Division is involved?' ;
    $scope.mySubTitle = 'Who should we contact?' ;
    $scope.lowercasehandle = function() {
        return $filter('lowercase')($scope.handle);
    };

    $scope.getsiteList = function() {
      dataFactory.getsiteList() ;  
    };
    $scope.searchBox = '' ;
    $scope.characters = 5;
    $scope.nodeData = dataFactory.nodeData ;
    $scope.treeData = dataFactory.treedata ;
    $scope.partners = {} ;
    $scope.screenModel = dataFactory.screenModel ;
        $scope.screenModel.btn = true;
        $scope.screenModel.warn = false ; 
    $scope.division = dataFactory.screenModel.division ;
      
  $scope.treeOptions = {
    nodeChildren: "nodes",
    dirSelectable: true,
    injectClasses: {
        ul: "a1",
        li: "a2",
        liSelected: "a7",
        iExpanded: "a3",
        iCollapsed: "a4",
        iLeaf: "a5",
        label: "a6",
        labelSelected: "a8"
    }
}     
  $scope.openBPSearch = function( size) {

    var modalBPInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalBPContent.html',
      controller: 'ModalBPInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.partners;
        },
        screenModel:function () {
          return $scope.screenModel;
        }
      }
    });
          modalBPInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.createcall = function( size) {
    var tempcode = $scope.screenModel.servicecode.split('-') ;
    $scope.screenModel.servicecode = tempcode[0] ;
     var result = $.grep($scope.nodeData, function(e){ return e.NodeKey == $scope.screenModel.servicecode; }); 
     $scope.screenModel.effect = result[0].Effect ;
     $scope.screenModel.routing  = result[0].Routing ;
     $scope.screenModel.department = result[0].Department ;
     var temp2 =  $scope.screenModel.altpartner.split('-') ; 
    $scope.calllog = {
            gAltPartner: temp2[0] ,
            gDept: $scope.screenModel.department ,
            gEffect: $scope.screenModel.effect ,
            gFloor: $scope.screenModel.floor.SWENR ,
            gPartner: $scope.screenModel.partner ,
            gRoom: $scope.screenModel.room ,
            gRouting: $scope.screenModel.routing ,
            gSource: 'Internet',
            gTkombuildclass:$scope.screenModel.bupriority ,
            gTplnr: '6000-' + $scope.screenModel.sitecode + '-' + $scope.screenModel.building.SWENR ,
            gTxt: $scope.screenModel.shorttext ,
            gZpriority:  $scope.screenModel.tkombuildclass || '5' ,
            longText: $scope.screenModel.longtext ,
            gQmnumr: $scope.screenModel.notification
    } ;
   var callsuccess = function(res) {
      var temp = res ; 
       var outstr = 'Notification Created:' + temp.gQmnumr ;
       alert(outstr) ;
        $window.location.href = '#/';
   } ;
   AuthsFactory.postNotif(callsuccess, function (res) {
            $rootScope.error = res.error || 'Failed to get data';
                    } , $scope.calllog) ;
      
    return ;  
    var modalCCInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalCreateCall.html',
      controller: 'ModalCCInstanceCtrl',
      size: size,
      resolve: {
        screenModel:function () {
          return $scope.screenModel;
        }
      }
    });  
    modalCCInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.openSite = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.floorList;
        },
        screenModel:function () {
          return $scope.screenModel;
        }
      }
    });
  
    modalInstance.result.then(function (selectedItem) {
      $scope.locationStatus  = true;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.openService = function (size) {

      var modalSrvInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'myModalService.html',
          controller: 'ModalSrvInstanceCtrl',
          size: size,
          resolve: {
              items: function () {
                  return $scope.nodeData;
              },
              screenModel: function () {
                  return $scope.screenModel;
              }
          }
      });

      modalSrvInstance.result.then(function (selectedItem) {

      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });
  };
 $scope.openTreeService = function (size) {

      var modalSrvInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'myModalTreeService.html',
          controller: 'ModalSrvInstanceCtrl',
          size: size,
          resolve: {
              items: function () {
                  return $scope.treeData;
              },
              screenModel: function () {
                  return $scope.screenModel;
              }
          }
      });

      modalSrvInstance.result.then(function (selectedItem) {

      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });
  };
  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };


  $scope.checkvalid = function() {
  $scope.screenModel.longtext = $scope.screenModel.longtext || ' ' ;
  $scope.screenModel.shorttext = $scope.screenModel.shorttext || ' ' ;    
  $scope.screenModel.callStatus =   $scope.screenModel.locationStatus && $scope.screenModel.serviceStatus && $scope.screenModel.bpstatus ;
    $scope.screenModel.callStatus =  $scope.screenModel.callStatus && ( $scope.screenModel.longtext.length > 4 ) && ( $scope.screenModel.shorttext.length > 4 ) ;
    $scope.screenModel.callStatus = !$scope.screenModel.callStatus;
  } ;
    
          } ;
    
  angular.module('templateApp').controller('LocationController',locationcontroller) ;


})();
angular.module('templateApp').controller('ModalBPInstanceCtrl', function ($scope, $modalInstance, items, screenModel, AuthsFactory, $localStorage  ) {

  $scope.items = items;
  $scope.sitefilter="" ;
  $scope.screenfields = 'None Selected' ;
  $scope.showSelected = function(node) {
  screenModel.sitecode = node.key ; 
  $scope.screenfields = node.key + "-" + node.longkey;
  } ;
       $scope.lineselect = function (node) {
      screenModel.altpartner = node.PARTNERNO + '-' + node.NAME_FIRST + ' ' + node.NAME_LAST;
      screenModel.bpstatus = true;
    };
  $scope.BPList = [] ;
  $scope.selected = {
    item: $scope.items[0]
  };
          $scope.collapseAll = function() {
        $scope.$broadcast('collapseAll');
      };

      $scope.expandAll = function() {
        $scope.$broadcast('expandAll');
      };

      $scope.data = items ;
      $scope.toggle = function(scope) {
        scope.toggle();
      };
  $scope.BPSearch = function(searchname){
      var call = 'Partner=1&ClientId=TKBP&CallContext={Imp_Search:*'+ searchname + '*}'; 
      var token =  $localStorage.token;
      var that = $scope ;
      that.BPList = [] ;
      var successAuth = function(res) {
      for (var i = 0 ; i< res.ServicesList.length ; i++ ) {
              var tempObj = JSON.parse(res.ServicesList[i].JsonsetJstext);
                          
       that.BPList.push(tempObj ) ;   
      };} ;
       AuthsFactory.getData(token, successAuth, function (res) {
            $rootScope.error = res.error || 'Failed to get data';
                    },call);
                };
 
  $scope.ok = function () {
    screenModel.altPartner = $scope.screenfields ;
     $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('templateApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, screenModel, AuthsFactory, $localStorage) {

  $scope.floorList = screenModel.floorList;
    // Get the Standard Floor List from SAP
  $scope.getFloors = function(){
       var call = 'Partner=1&ClientId=TKBE&CallContext={BE_MASK:0,NAME_MASK:0}';  
      var token =  $localStorage.token;
      var that = $scope ;
      that.floorList = [] ;
      var successAuth = function(res) {
      for (var i = 0 ; i< res.ServicesList.length ; i++ ) {
              var tempObj = JSON.parse(res.ServicesList[i].JsonsetJstext);
                          
       that.floorList.push(tempObj ) ;   
      };} ;
       AuthsFactory.getData(token, successAuth, function (res) {
            $rootScope.error = res.error || 'Failed to get data';
                    },call);
    };
    // End of call to SAP floor List call

   
  $scope.sitefilter="" ;
    $scope.screenfields = 'None Selected' ;
    $scope.siteList = screenModel.siteList ;
    $scope.buildingList = screenModel.buildingList;
  $scope.lineSelect = function(node) {
     screenModel.sitecode = node.SWENR ; 
      screenModel.sitename = node.XWETEXT;
     $scope.screenfields = node.SWENR + "-" + node.XWETEXT;
     screenModel.locationStatus = true;
     $scope.doBUSearch(node.SWENR) ;
     if ($scope.floorList[1] == null) {
        $scope.getFloors() ;
    } ;
  }
  $scope.selected = {};
      $scope.data = items ;
      $scope.toggle = function(scope) {
        scope.toggle();
      };
  $scope.doSiteSearch=function(sitecode,sitename){
       var call = 'Partner=1&ClientId=TKBE&CallContext={BE_MASK:' + sitecode + ',NAME_MASK:' + sitename + '}';  
      var token =  $localStorage.token;
      var that = $scope ;
      that.siteList = [] ;
      var successAuth = function(res) {
      for (var i = 0 ; i< res.ServicesList.length ; i++ ) {
              var tempObj = JSON.parse(res.ServicesList[i].JsonsetJstext);
                          
       that.siteList.push(tempObj ) ;   
      };} ;
       AuthsFactory.getData(token, successAuth, function (res) {
            $rootScope.error = res.error || 'Failed to get data';
                    },call);
                };  
     $scope.doBUSearch=function(sitecode){
       var call = 'Partner=1&ClientId=TKBE&CallContext={BE_MASK:' + sitecode + ',NAME_MASK:BUILDINGLIST}';  
      var token =  $localStorage.token;
      var that = $scope ;
      that.buildingList = [] ;
      var successAuth = function(res) {
      for (var i = 0 ; i< res.ServicesList.length ; i++ ) {
              var tempObj = JSON.parse(res.ServicesList[i].JsonsetJstext);
                          
       that.buildingList.push(tempObj ) ;   
      };} ;
       AuthsFactory.getData(token, successAuth, function (res) {
            $rootScope.error = res.error || 'Failed to get data';
                    },call);
                };  
  $scope.ok = function () {
   $modalInstance.close($scope);
   screenModel.floorList = $scope.floorList;
   screenModel.buildingList = $scope.buildingList ;
   screenModel.siteList = $scope.siteList ;
   screenModel.building = $scope.screenModel.building;
   screenModel.floor = $scope.screenModel.floor;
   screenModel.sitename = $scope.screenfields ;
      screenModel.room = $scope.screenModel.room ;
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('templateApp').controller('ModalSrvInstanceCtrl', function ($scope, $modalInstance, items, screenModel) {

    $scope.items = items;
    $scope.screenModel = screenModel;
    $scope.sitefilter = "";
    $scope.screenfields = 'None Selected';
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.treeselect = function (node) {
        $scope.screenModel.servicecode = node.key;
        $scope.screenModel.longkey = node.longkey;
        $scope.screenModel.serviceStatus = true;
    };    
    $scope.lineselect = function (node) {
        $scope.screenModel.servicecode = node.NodeKey;
        $scope.screenModel.longkey = node.searchfield ;
        $scope.screenModel.effect = node.Effect;
        $scope.screenModel.department = node.Department;
        $scope.screenModel.serviceStatus = true;
    };
    $scope.collapseAll = function () {
        $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function () {
        $scope.$broadcast('expandAll');
    };

    $scope.data = items;
    $scope.toggle = function (scope) {
        scope.toggle();
    };
    $scope.doSearch = function (sitecode, sitename) {
        dataFactory.dobuildingsearch(sitecode, sitename);
    }
    $scope.serviceok = function () {
        $modalInstance.close($scope.screenModel);
    };

    $scope.servicecancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('templateApp').controller('ModalCCInstanceCtrl', function ($scope, $modalInstance, screenModel, AuthsFactory, $localStorage  ) {

  $scope.screenModel = screenModel ;
  var abs1 = 1 ;
  $scope.BPSearch = function(searchname){
      var call = 'Partner=1&ClientId=TKBP&CallContext={Imp_Search:*'+ searchname + '*}'; 
      var token =  $localStorage.token;
      var that = $scope ;
      that.BPList = [] ;
      var successAuth = function(res) {
      for (var i = 0 ; i< res.ServicesList.length ; i++ ) {
              var tempObj = JSON.parse(res.ServicesList[i].JsonsetJstext);
                          
       that.BPList.push(tempObj ) ;   
      };} ;
       AuthsFactory.getData(token, successAuth, function (res) {
            $rootScope.error = res.error || 'Failed to get data';
                    },call);
                };
 
  $scope.ok = function () {
        $modalInstance.close(screenModel.callStatus);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});