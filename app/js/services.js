app
    .service('PrjService', function () {
       var prjs = [
           {
           _id: '0',
               _pid: undefined,
           name:'Project 2016 LAST',
           description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
           duedate:'1287323733006', 
           inidate:'1288323623006',
           lstdate:'1466082756235',
           status: 'closed',
           priority: '1'
        },{
           _id: '1',
            _pid: '0',
           name:'Project 2016 JAN',
           duedate:'20123470505', 
           inidate:'20123450505',
           lstdate:'1465564356231',
           description:'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
           status: 'created',
           priority: '0'
        },{
           _id: '223',
            _pid: '0',
           name:'Project 2016 FEB',
           duedate:'2011172340101', 
           inidate:'20160324505',
           lstdate:'1465564356231',
           description:'Note the use of Angular expressions with the curly braces  to include various properties of the JavaScript object to construct the menu item',
           status: 'created',
           priority: '2'
        },{
           _id: '034',
            _pid: '223',
           name:'2016 FEB WEEK 1',
           duedate:'2340172340101', 
           lstdate:'1465803181937',
           inidate:'1465564356231',
           description:'Note the use of Angular expressions with the curly braces  to include various properties of the JavaScript object to construct the menu item',
           status: 'progress',
           priority: '0'
        },{
           _id: '324',
            _pid: '223',
           name:'2016 FEB WEEK 2',
           duedate:'2140172340101', 
           lstdate:'1288323623006',
           inidate:'2016032344505',
           status: 'suspended',
           description:'Several date to millisecond calculators, useful when coding countdown timers, ... Milliseconds to date string different than date to milliseconds for the same date',
           priority: '2'
        },{
            _id: '804569',
           name:'Project 2016 root',
           description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
           duedate:'20142360505', 
           inidate:'20123450505',
           status: 'abandoned',
           priority: '1'
        },{
           _id: '809',
           name:'Project ABC root',
           duedate:'20123470505', 
           lstdate:'1288323623006',
           inidate:'20123450505',
           description:'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
           status: 'closed',
           priority: '0'
        },{
            _id: '111',
           name:'Project ABC - Child',
            _pid: '809',
           duedate:'2011172340101', 
           lstdate:'1288323623006',
           inidate:'20160324505',
           description:'Note the use of Angular expressions with the curly braces  to include various properties of the JavaScript object to construct the menu item',
           priority: '2'
        },{
           _id: '304',
            _pid:'034',
           name:'GOOD TEST chil fo 34',
           duedate:'2140172340101', 
           lstdate:'1288323623006',
           inidate:'2016044324505',
           description:'Note the use of Angular expressions with the curly braces  to include various properties of the JavaScript object to construct the menu item',
           priority: '0'
        },{
           _id: '78',
            _pid:'034',
           name:'EXAMPLE TEST child of 34',
           duedate:'2140172340101', 
           lstdate:'1288323623006',
           inidate:'2016032344505',
           description:'Several date to millisecond calculators, useful when coding countdown timers, ... Milliseconds to date string different than date to milliseconds for the same date',
           priority: '2'
        }];
        
        var priorityColors = ['danger','warning','success'];
        var priorityLabels = ['High','Medium','Normal'];
    
    
        this.list = function(onlyRoot){
            if (onlyRoot)
                return prjs.filter(function(e){return (e._pid === undefined);});
            return prjs;
        };
    
        this.recent = function(agems, count){
            count = count || 10;
            agems = agems || 518400000; // 4d
            var nowdate = Date.now();
            return prjs.filter(function(e){return (nowdate - agems < e.lstdate);});
        };
    
        this.get = function(id){
            if (id === undefined || isNaN(id)) return this.empty();
            for (var i in prjs)
                if (prjs[i]._id == id) return prjs[i];
            return {};
        };
        
        this.getSubProjects = function(prjId){
            var subPrjs = [];
            var i = 0;
            for (i in prjs)
                if (prjs[i]._pid == prjId) subPrjs.push(prjs[i]);
            for (i in subPrjs)
                subPrjs[i].children = this.getSubProjects(subPrjs[i]._id);
            return subPrjs;
        };
        
        this.save = function(prj){
            if (prj._id === undefined) {
                prj._id = Math.ceil(Math.random()*100000000);
                prjs.push(prj);
            } else {
                for (var i in prjs) {
                    if (prjs[i]._id == prj._id) {
                        prjs[i] = prj;
                    }
                }
            }
        };
        
        this.delete = function(prj){
            if (prj._id === undefined || isNaN(prj._id)) return false;
            prjs = prjs.filter(function(e){return (e._id!=prj._id);});
            return true;
        };
        
        this.empty = function(){
            return {
                duedate:Date.now(), 
                inidate:Date.now(),
                lstdate:Date.now(),
                status: 'created',
                priority: '1'
            };
        };
        
        this.getPriorityColors = function(){
            return priorityColors;
        };
        this.getPriorityLabels = function(){
            return priorityLabels;
        };
        this.getStatus = function(){
            return utils.extractUnique(utils.extractField(prjs,'status'));
        };
    });