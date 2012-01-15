var socket = io.connect(window.location.origin);

var App = new Ext.Application({
    name: "seatMate"
});

Ext.setup({
    icon: 'img/icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    onReady: function() {

        App.models.Route = Ext.regModel('Route', {
            fields: [{
                name: 'route',
                type: 'string'
            },
            {
                name: 'description',
                type: 'string'
            }
            ]
        });

        App.models.Comment = Ext.regModel('Comment', {
            fields: [{
                name: 'date',
                type: 'date',
                format: 'g:i a d/h/Y'
            },
            {
                name: 'text',
                type: 'string'
            },
            {
                name: 'profile_image_url',
                type: 'string'
            }],
            proxy: {
               type: 'localstorage',
                id  : 'comment'
            }
        });
        
        Ext.regController('Route', {
            

        });

        Ext.regController('Comment', {
            submitComment: function (param) {
                App.commentStore.add({
                "date": new Date(), // .format('g:i a d/h/Y'),
                "comment": param.data.comment,
                "profile_image_url": "http://placekitten.com/48/48"
                });
                App.commentStore.sort();
                App.comments.refresh();
                socket.emit('submit-comment', {comment: param.data.comment});
           }
        });


        App.routeStore = new Ext.data.Store({
            model: 'Route',
            data: [],
            sorters: [{ property: 'route',  direction: 'DESC' }]
        });

        // load the routes
        var refreshRoutes = function () {
                socket.emit('get-routes', 3, 3, function (routes) {
                Ext.each(routes, function (route, index) {
                    App.routeStore.add(route);
                });
                App.routeList.refresh();
            });
        };
        refreshRoutes();
        var commentData = [];
        Ext.each(rawComments, function(rawComment, index) {
            var comment = JSON.parse(rawComment);
            commentData.push({
                "date": new Date(comment.ts), //.format('g:i a d/h/Y'),
                "comment": comment.text
            });
        });
        App.commentStore = new Ext.data.Store({
            model: 'Comment',
            data: commentData,
            sorters: [{ property: 'date',  direction: 'DESC' }]
        });

        App.comments = new Ext.List({
            title: 'Comments',
            cls: 'timeline',
            scroll: 'vertical',
            flex: 3,
            store: App.commentStore,
            itemTpl: Ext.XTemplate.from('comment-template')

        });

        App.routeList = new Ext.List({
            cls: 'timeline',
            scroll: 'vertical',
            flex: 3,
            store: App.routeStore,
            itemTpl: Ext.XTemplate.from('route-template')
        });
        App.routes = new Ext.Panel({
             title: 'routes',
             type: 'vbox',
             items: [
                App.routeList,
                new Ext.Map({
                   title: "Map",
                   flex: 2,
                   useCurrentLocation: true
                })
            ]
        });


        // App.comments.update();

        App.form = new Ext.form.FormPanel({
            title: 'comment',
            scroll: 'vertical',
            standardSubmit: true,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [
            App.comments,
            {
                xtype: 'fieldset',
                title: 'leave a comment',
                instructions: 'comment will be seen by other riders of the 14',
                flex: 1,
                defaults: {
                    required: false,
                    labelAlign: 'left',
                    labelWidth: '25%'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'comment',
                    label: 'comment',
                    useClearIcon: true,
                    autoCapitalize: false
                }]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'spacer'
                }, {
                    text: 'leave a comment',
                    ui: 'confirm',
                    handler: function() {

                        Ext.dispatch({
                            controller: 'Comment',
                            action: 'submitComment',
                            data: App.form.getValues()
                        });
                        App.form.reset();
                    }
                }]
            }]
        });
        
    
        App.panel = new Ext.TabPanel({
            fullscreen: true,
            ui: 'light',
            sortable: true,
            cardSwitchAnimation: {type: 'fade', duration: 200},
            items: [
            App.routes,
            App.form,
            {
                title: 'chat',
                html: 'chat',
                cls: 'card2'
            }, {
                title: 'flirt',
                html: 'flirt',
                cls: 'card3'
            }]
        });

        App.panel.getTabBar().add([
            { xtype: 'spacer' },
            {
                xtype: "button",
                iconMask: "true",
                iconCls: "refresh",
                ui: 'plain',
                style: 'margin:0',
                handler: refreshRoutes
            }
        ]);
        App.panel.getTabBar().doLayout();
    }
});