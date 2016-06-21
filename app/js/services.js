app
    .service('PrjService', function () {
       var prjs = [
           {
           _id: '0',
               _pid: undefined,
           name:'Project 2016 LAST',
           description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
           duedate:'1387323733006', 
           inidate:'1288323623006',
           lstdate:'1466082756235',
           status: 'closed',
            childrenTab: 'pt', 
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
            childrenTab: undefined,
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
            childrenTab: 'p',
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
            childrenTab: 't',
           priority: '0'
        },{
           _id: '78',
            _pid:'034',
           name:'EXAMPLE TEST child of 34',
           duedate:'2140172340101', 
           lstdate:'1288323623006',
           inidate:'2016032344505',
           description:'Several date to millisecond calculators, useful when coding countdown timers, ... Milliseconds to date string different than date to milliseconds for the same date',
            childrenTab: 't',
           priority: '2'
        }];
        
        var priorityColors = ['danger','warning','success'];
        var priorityLabels = ['High','Medium','Normal'];
    
    
        this.list = function(onlyRoot){
            if (onlyRoot)
                return prjs.filter(function(e){return (e._pid === undefined || isNaN(e._pid));});
            return prjs;
        };
    
        this.recent = function(agems, count){
            count = count || 10;
            agems = agems || 518400000; // 4d
            var nowdate = Date.now();
            return prjs.filter(function(e){return (nowdate - agems < e.lstdate);});
        };
    
        this.get = function(id, pid){
            if (id === undefined || isNaN(id)) return this.empty(pid);
            for (var i in prjs)
                if (prjs[i]._id == id) return prjs[i];
            return {};
        };
        
        this.getSubProjects = function(prjId){
            //console.log('getSubProjects ',prjId);
            var subPrjs = [];
            var i = 0;
            for (i in prjs)
                if (prjs[i]._pid == prjId) subPrjs.push(prjs[i]);
            for (i in subPrjs)
                subPrjs[i].children = this.getSubProjects(subPrjs[i]._id);
            return subPrjs;
        };
        
        this.getChain = function(pid){
            if (pid === undefined || isNaN(pid)) return [];
            for (var i in prjs)
                if (prjs[i]._id == pid)
                    return Array.prototype.concat(this.getChain(prjs[i]._pid), prjs[i]);
            return [];
        };
    
        this.save = function(prj){
            prj.lstdate = Date.now();
            if (prj._id === undefined) {
                prj._id = ''+Math.ceil(Math.random()*100000000);
                prjs.push(prj);
                return prj;
            } else {
                for (var i in prjs) {
                    if (prjs[i]._id == prj._id) {
                        prjs[i] = prj;
                        return prj;
                    }
                }
            }
        };
    
        this.copy = function(prj, pid){
            pid = pid || undefined;
            var children = prj.children;
            prj.children = undefined;
            //var newPrj = jQuery.extend(true, {}, prj); // it makes $$hashKey copy=>angular dup error
            var newPrj = angular.copy(prj);
            prj.children = children;
            newPrj._id = undefined;
            if (pid) newPrj._pid = pid;
            //newPrj.childrenTab = undefined;
            return newPrj;
        };
        
        this.delete = function(prj){
            if (prj._id === undefined || isNaN(prj._id)) return false;
            prjs = prjs.filter(function(e){return (e._id!=prj._id);});
            return true;
        };
        
        this.empty = function(pid){
            return {
                _pid: pid,
                name:'Please give me a name!',
                duedate:Date.now(), 
                inidate:Date.now(),
                lstdate:Date.now(),
                status: 'created',
                childrenTab: undefined,
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
    })

.service('TaskService', function () {
       var tasks = [
           {
            _id: '001',
            _pid: '78',
            name:'Task 001',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '34',
            _pid: '78',
            name:'Task 002',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '43534',
            _pid: '78',
            name:'Task 003',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '234',
            _pid: '78',
            name:'Task 004',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '23564',
            _pid: '78',
            name:'Task 004a',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '556',
            _pid: '78',
            name:'Task 005',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '3456',
            _pid: '78',
            name:'Task 006',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1388323623006',
            lstdate:'1366082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '3456',
            _pid: '78',
            name:'Task 007',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1388323623006',
            lstdate:'1366082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '788',
            _pid: '78',
            name:'Task 008',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '240',
            _pid: '78',
            name:'Task 009',
            description: 'This directive can be abused to add unnecessary amounts of logic into your templates. There are only a few appropriate uses of ngInit, such as for aliasing special properties of ngRepeat, as seen in the demo below; and for injecting data via server side scripting. Besides these few cases, you should use c',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '34545',
            _pid: '78',
            name:'Task 010',
            description: 'Note: If you have assignment in ngInit along with a filter, make sure you have parentheses to ensure correct operator precedence: ',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '3455',
            _pid: '79',
            name:'Task 002 NOT GOOD',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1466082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },{
            _id: '001',
            _pid: '79',
            name:'Task 001 NOT GOOD',
            description: 'Next go to the content row in the body of the page, and add some data to be used within the application, by using the ng-init directive as follows',
            duedate:'1387323733006', 
            inidate:'1288323623006',
            lstdate:'1366082756235',
            status: 'closed',
            priority: '1',
            assignedTo:'pippo@gmail.com',
            assignedBy:'admin@fff.com'
        },];
        
        var priorityColors = ['danger','warning','success'];
        var priorityLabels = ['High','Medium','Normal'];
    
    
        this.list = function(prjId){
            return tasks.filter(function(e){return (e._pid == prjId);});
        };
    
        this.recent = function(agems, count){
            count = count || 10;
            agems = agems || 518400000; // 4d
            var nowdate = Date.now();
            return tasks.filter(function(e){return (nowdate - agems < e.lstdate);});
        };
    
        this.get = function(id){
            if (id === undefined || isNaN(id)) return this.empty();
            for (var i in tasks)
                if (tasks[i]._id == id) return tasks[i];
            return {};
        };
        
        this.save = function(task){
            task.lstdate = Date.now();
            if (task._id === undefined) {
                task._id = Math.ceil(Math.random()*100000000);
                tasks.push(task);
            } else {
                for (var i in tasks) {
                    if (tasks[i]._id == task._id) {
                        tasks[i] = task;
                    }
                }
            }
        };
        
        this.delete = function(task){
            if (task._id === undefined || isNaN(task._id)) return false;
            tasks = tasks.filter(function(e){return (e._id!=task._id);});
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
            return utils.extractUnique(utils.extractField(tasks,'status'));
        };
    });