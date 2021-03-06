var app = angular.module('taskmanager', ['ui.router','treeGrid','ui.bootstrap','ui.bootstrap.datetimepicker']);   
        
app.controller( 'LandingCtrlr', ['$scope', 'PrjService', function($scope, PrjService) {
        console.log('LandingCtrlr');
        $scope.prjs = PrjService.recent();
    console.log($scope.prjs);
}]);
                              
app.controller( 'PrjsCtrlr', ['$scope', 'PrjService', function($scope, PrjService) {
        console.log('PrjsCtrlr:');
        $scope.prjs = PrjService.list(true); // false: all, true: onlyRoot prjs
        $scope.date = new Date();
        $scope.priorityColors = PrjService.getPriorityColors();
        $scope.priorityLabels = PrjService.getPriorityLabels();
        $scope.prjSorter = 'duedate';
        $scope.prjFilter = {};
        $scope.prjFilter.text = '';
        $scope.prjFilter.last = false;
        $scope.prjFilter.favourites = false;
        $scope.prjFilter.elapsed='259200000'; // 48h
        $scope.prjFilter.status = 'all';
        $scope.prjFilter.do = function(item){
            return (
                (
                    $scope.prjFilter.text === undefined ||
                    $scope.prjFilter.text.trim().length === 0 ||
                    ((item.description.indexOf($scope.prjFilter.text)>=0) ||
                    (item.name.indexOf($scope.prjFilter.text)>=0)) 
                ) &&
                (   // last used
                    $scope.prjFilter.last === false ||
                    ($scope.date - $scope.prjFilter.elapsed < item.lstdate)
                ) &&
                (   // favourites
                    true
                ) &&
                (   // status
                    $scope.prjFilter.status === 'all' ||
                    (item.status == $scope.prjFilter.status)
                )
            );
        };
        $scope.prjStatus = PrjService.getStatus();
        $scope.prjStatus.push($scope.prjFilter.status);

    }]);

app.controller( 'PrjCtrlr', ['$scope', '$state', '$stateParams', 'PrjService', 'TaskService', function($scope, $state, $stateParams, PrjService, TaskService) {
        console.log('PrjCtrlr:',$stateParams.id,",",$stateParams.pid);
        var id =parseInt($stateParams.id,10);
        var pid =parseInt($stateParams.pid,10);
        $scope.prj = PrjService.get(id, pid);
        $scope.tasks = TaskService.list(id);
        $scope.parents = PrjService.getChain($scope.prj._pid);
        $scope.prjSorter = 'inidate';
        $scope.dateFormat = 'MMM dd, yyyy hh:mm';
        //$scope.prj.inidate = new Date(parseInt($scope.prj.inidate));
        //$scope.prj.duedate = new Date(parseInt($scope.prj.duedate));
        // button bar
        $scope.pickerIni = {
            //date: new Date(parseInt($scope.prj.inidate)),
            saveAs: 'number',
            readAs: function(data) {
                return new Date(parseInt(data));
              }
        };
        $scope.pickerDue = {
            //date: new Date(parseInt($scope.prj.inidate)),
            saveAs: 'number',
            readAs: function(data) {
                return new Date(parseInt(data));
              }
        };
        $scope.priorityColors = PrjService.getPriorityColors();
        $scope.priorityLabels = PrjService.getPriorityLabels();
        $scope.prjStatus = PrjService.getStatus();
        $scope.message = {};
        $scope.message.show = 'none';
        $scope.message.type = 'success';
        $scope.isNew = function(prj){
            console.log('isNew:',prj._id,",",(prj._id === undefined || isNaN(prj._id)));
            return (prj._id === undefined || isNaN(prj._id));
        };
        $scope.save = function(prj){
            var wasNew = $scope.isNew(prj);
            prj = PrjService.save(prj);
            $scope.message.text = 'Success! The project is saved.';
            $scope.message.show = '';
            $scope.message.type = 'success';
//            if (wasNew)
//                $state.go('app.prj({id:prj._id})');
        };
        $scope.deepCopy = function(pid, children){
            for(var i in children){
                console.log('p:',children[i]);
                var newp = PrjService.save(PrjService.copy(children[i], pid));
                this.deepCopy(newp._id, children[i].children);
            }
        };
        $scope.copy = function(prj, deep){
            deep = deep || false;
            prj = PrjService.save(PrjService.copy(prj));
            if (deep){
                $scope.deepCopy(prj._id, $scope.tree_data);
            }
            $state.go('app.prj',{id:prj._id});
        };
        $scope.createSubPrj = function(){
            //var pid = $scope.prj._id;
            //$scope.prj = PrjService.empty();
            //$scope.prj._pid = pid;
            $state.go('app.prj', {id: undefined, pid:$scope.prj._id});
        };
        $scope.delete = function(prj){
            if (PrjService.delete(prj)){
                $scope.message.text = 'The project is deleted.';
                $scope.message.show = '';
                $scope.message.type = 'success';
                $state.go('app.projects');
            }else{
                $scope.message.text = 'It is not possible to delete it.';
                $scope.message.show = '';
                $scope.message.type = 'danger';
            }
        };
        
        // sub project tree grid
        $scope.expanding_property = {
            field: "name", displayName: "Name"
        };
        indexof = function(items, field, value){
            return  items.map(function(e) { return e[field]; }).indexOf(value);
        }
        swap = function(items,pos1,pos2){
            if (pos1<0) pos1 = items.length-1;
            if (pos2>items.length-1) pos2 = 0;
            console.log('swap:',pos1,'-',pos2);
            var t = items[pos1];
            items[pos1] = items[pos2];
            items[pos2] = t;
            return items;
        }
        $scope.col_defs = [        
          {
            field: "_id", displayName: " ",
            cellTemplate: "<div>&nbsp;&nbsp;"+
              "<a ui-sref='app.prj({id: row.branch[col.field]})'><span class='glyphicon glyphicon-edit'></span></a>"+
              "<a ng-if='row.level==1' href='javascript:;' ng-click='cellTemplateScope.tree_moveup(row.branch[col.field])'><span class='glyphicon glyphicon-arrow-up'></span></a>"+
              "<a ng-if='row.level==1' href='javascript:;' ng-click='cellTemplateScope.tree_movedown(row.branch[col.field])'><span class='glyphicon glyphicon-arrow-down'></span></a>"+
              "</div>",
            cellTemplateScope: {
                tree_moveup: function(id) {         // this works too: $scope.someMethod;
                    console.log('up:',id);
                    var i = indexof($scope.tree_data,'_id',id);
                    $scope.tree_data = swap($scope.tree_data,parseInt(i)-1,i);
                },
                tree_movedown: function(id) {         // this works too: $scope.someMethod;
                    console.log('down:',id);
                    var i = indexof($scope.tree_data,'_id',id);
                    $scope.tree_data = swap($scope.tree_data,i,parseInt(i)+1);
                }
            }
        },
        {  field: "description", displayName: "Description", classes: "hidden-xs",
           cellTemplate: "<span>{{row.branch[col.field]| limitTo:50}}...</span>" 
          },
          {  field: "inidate", displayName: "Started" , cellTemplate:"<span>{{row.branch[col.field]| date:'medium'}}</span>", classes: "hidden-xs"},
          {  field: "duedate", displayName: "Due Date", cellTemplate:"<span>{{row.branch[col.field]| date:'medium'}}</span>" , classes: "hidden-xs"}
        ];
        $scope.my_tree = {};
        $scope.my_tree_handler = function(branch){
            console.log('you clicked on ', branch);
        };
        $scope.loadTree = function(prj, cache){
            console.log('loadTree');
            if (cache && $scope.tree_data !== undefined) return;
            console.log('loadTree...from service');
            //            [
//                {Name:"USA",Area:9826675,Population:318212000,TimeZone:"UTC -5 to -10",
//                  children:[
//                    {Name:"California", Area:423970,Population:38340000,TimeZone:"Pacific Time",
//                        children:[
//                            {Name:"San Francisco", Area:231,Population:837442,TimeZone:"PST"},
//                            {Name:"Los Angeles", Area:503,Population:3904657,TimeZone:"PST"}
//                        ]
//                    },
//                    {Name:"Illinois", Area:57914,Population:12882135,TimeZone:"Central Time Zone",
//                        children:[
//                            {Name:"Chicago", Area:234,Population:2695598,TimeZone:"CST"}
//                        ]
//                    }
//                ]
//                },    
//                {Name:"Texas",Area:268581,Population:26448193,TimeZone:"Mountain"}
//            ];
            if (prj._id === undefined) $scope.tree_data = [];
            else $scope.tree_data = PrjService.getSubProjects(prj._id);
        };
    }]);
/*
app.controller( 'TaskCtrlr', ['$scope', '$state', '$stateParams', 'TaskService', function($scope, $state, $stateParams, TaskService) {
        console.log('TaskCtrlr');
        $scope.prj = TaskService.get(parseInt($stateParams.id,10));
        //$scope.prj.inidate = new Date(parseInt($scope.prj.inidate));
        //$scope.prj.duedate = new Date(parseInt($scope.prj.duedate));
        // button bar
        $scope.pickerIni = {
            //date: new Date(parseInt($scope.prj.inidate)),
            saveAs: 'number',
            readAs: function(data) {
                return new Date(parseInt(data));
              }
        };
        $scope.pickerDue = {
            //date: new Date(parseInt($scope.prj.inidate)),
            saveAs: 'number',
            readAs: function(data) {
                return new Date(parseInt(data));
              }
        };
        $scope.priorityColors = PrjService.getPriorityColors();
        $scope.priorityLabels = PrjService.getPriorityLabels();
        $scope.prjStatus = PrjService.getStatus();
        $scope.message = {};
        $scope.message.show = 'none';
        $scope.message.type = 'success';
        $scope.isNew = function(prj){
            console.log('isNew');
            return (prj._id === undefined || isNaN(prj._id));
        };
        $scope.save = function(prj){
            prj = PrjService.save(prj);
            $scope.message.text = 'Success! The project is saved.';
            $scope.message.show = '';
            $scope.message.type = 'success';
            //if (!isNew(prj))
            //    $state.go('app.prj({id:prj._id})');
        };
        $scope.delete = function(prj){
            if (PrjService.delete(prj)){
                $scope.message.text = 'The project is deleted.';
                $scope.message.show = '';
                $scope.message.type = 'success';
                $state.go('app.projects');
            }else{
                $scope.message.text = 'It is not possible to delete it.';
                $scope.message.show = '';
                $scope.message.type = 'danger';
            }
        };
        
        // sub project tree grid
        $scope.expanding_property = {
            field: "name", displayName: "Name"
        };
        $scope.col_defs = [        
          {
            field: "_id", displayName: " ",
            cellTemplate: "<a ui-sref='app.prj({id: row.branch[col.field]})'>&nbsp;&nbsp;<span class='glyphicon glyphicon-edit'></span></a>"
        },
        {  field: "description", displayName: "Description", classes: "hidden-xs",
           cellTemplate: "<span>{{row.branch[col.field]| limitTo:50}}...</span>" 
          },
          {  field: "inidate", displayName: "Started" , cellTemplate:"<span>{{row.branch[col.field]| date:'medium'}}</span>", classes: "hidden-xs"},
          {  field: "duedate", displayName: "Due Date", cellTemplate:"<span>{{row.branch[col.field]| date:'medium'}}</span>" , classes: "hidden-xs"}
        ];
        $scope.my_tree = {};
        $scope.my_tree_handler = function(branch){
            console.log('you clicked on', branch);
        };
        $scope.loadTree = function(prj, cache){
            console.log('loadTree');
            if (cache && $scope.tree_data !== undefined) return;
            console.log('loadTree...from service');
            //            [
//                {Name:"USA",Area:9826675,Population:318212000,TimeZone:"UTC -5 to -10",
//                  children:[
//                    {Name:"California", Area:423970,Population:38340000,TimeZone:"Pacific Time",
//                        children:[
//                            {Name:"San Francisco", Area:231,Population:837442,TimeZone:"PST"},
//                            {Name:"Los Angeles", Area:503,Population:3904657,TimeZone:"PST"}
//                        ]
//                    },
//                    {Name:"Illinois", Area:57914,Population:12882135,TimeZone:"Central Time Zone",
//                        children:[
//                            {Name:"Chicago", Area:234,Population:2695598,TimeZone:"CST"}
//                        ]
//                    }
//                ]
//                },    
//                {Name:"Texas",Area:268581,Population:26448193,TimeZone:"Mountain"}
//            ];
            if (prj._id === undefined) $scope.tree_data = [];
            else $scope.tree_data = PrjService.getSubProjects(prj._id);
        };
    }]);
*/
app.config(function($stateProvider, $urlRouterProvider) {
    console.log('stateProvider');
        $stateProvider
            .state('app', {
                url:'/',
                views: {
                    'header':{
                        templateUrl : 'views/header.html',
                        controller  : 'LandingCtrlr'
                    },
                    'content@': {
                        templateUrl : 'views/landing.html',
                        controller  : 'LandingCtrlr'
                    }
                }
            })
            .state('app.projects', {
                url:'projects',
                views: {
                    'content@': {
                        templateUrl : 'views/projects.html',
                        controller  : 'PrjsCtrlr'
                     }
                }
            })
            .state('app.prj', {
                url: 'projects/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/project.html',
                        controller  : 'PrjCtrlr'
                   },'postcontent@':{
                            templateUrl : 'dtinit.html',
                       }
                },
                params: {
                  pid: { value: undefined }
                }
            });
        $urlRouterProvider.otherwise('/');
    });

// datetime picker (not used)
app.directive('msMills', function() {
  return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(viewValue) {
                var n = +(new Date(viewValue));
                console.log('ms-mills>parsers:',viewValue,":",n);
                return n;
            });
//            ngModel.$formatters.push(function(data) {
//                  console.log('ms-mills>formatter:',data);
//                //convert data from model format to view format
//                return new Date(parseInt(data)); //converted
//              });
		}
	};
});

// to watch datatable (not used)
app.directive('msDtinit', function() {
    return {
        link: function($scope, element, attrs) {
            // Trigger when number of children changes,
            // including by directives like ng-repeat
            var watch = $scope.$watch(function() {
                return element.children().length;
            }, function() {
                // Wait for templates to render
                $scope.$evalAsync(function() {
                    // Finally, directives are evaluated
                    // and templates are renderer here
                    element.dataTable({select: {style: 'multi'}, responsive:true});   
                });
            });
        },
    };
});

// to load accordions dynamically
// <ms-accordion data=”[p|t]”/>
app.directive('msAccordionStatic', function() {
    console.log('áccordion-static');
  return {
    template: '<ng-include src="getTemplateUrl()"/>',
    scope: {
      accType: '=data'
    },
    restrict: 'E',
    controller: function($scope) {
      //function used on the ng-include to resolve the template
      $scope.getTemplateUrl = function() {
          console.log('accordion:',"tpls/"+$scope.accType+"list.html");
          return "tpls/"+$scope.accType+"list.html"; 
      }
    }
  };
});

// to load accordions dynamically (and compiled)
// <ms-accordion data=”[p|t]”/>
app.directive('msAccordion', function($templateRequest, $compile,$rootScope,$timeout) {
    console.log('áccordion');
    var linker = function(scope, element){
       $templateRequest("tpls/"+scope.accType+"list.html").then(function(html){
          var template = angular.element(html);
           console.log(template.html());
          $compile(template)(scope);
          $timeout(function() {
            console.log('dopo:',template.html());
            element.html(template).show();
            $rootScope.$apply(); 
          });
       });
    };
    
  return {
    restrict: "E",
    link: linker,
    scope: {
        accType: '=data'
    }
  };
});
