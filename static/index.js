var socket = io.connect(window.location.origin);
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/997/256/{z}/{x}/{y}.png',
            cloudmadeAttribution = 'and cloudmade',
            cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

var App = new Ext.Application({
    name: "seatMate"
});

Ext.setup({
    icon: 'img/icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    // afterRender: function () {
    //     // initialize the map on the "map" div
    //     App.map = new L.Map('map');
    //     App.geo.updateLocation();
    //     // set the map view to a given center and zoom and add the CloudMade layer
    //     //App.map.setView(new L.LatLng(45.515, -122.68), 13).addLayer(cloudmade);

    //     // create a marker in the given location and add it to the map
    //     //var marker = new L.Marker(new L.LatLng(45.55, -122.79));
    //     //map.addLayer(marker);
                    
    // },
    onReady: function() {

        App.models.Route = Ext.regModel('Route', {
            fields: [{
                name: 'route',
                type: 'string'
            }, {
                name: 'description',
                type: 'string'
            }]
        });

        App.models.Comment = Ext.regModel('Comment', {
            fields: [{
                name: 'date',
                type: 'date',
                format: 'g:i a d/h/Y'
            }, {
                name: 'text',
                type: 'string'
            }, {
                name: 'profile_image_url',
                type: 'string'
            }],
            proxy: {
                type: 'localstorage',
                id: 'comment'
            }
        });

        Ext.regController('Route', {


        });

        socket.on('new-route-message', function (data) {
            App.commentStore.add({
                    "date": new Date(),
                    // .format('g:i a d/h/Y'),
                    "comment": data.text
                });
            App.commentStore.sort();
            App.comments.refresh();
        });
        Ext.regController('Comment', {
            submitComment: function(param) {
                    socket.emit('submit-comment', {
                    comment: param.data.comment
                });
            }
        });


        App.routeStore = new Ext.data.Store({
            model: 'Route',
            data: [],
            sorters: [{
                property: 'route',
                direction: 'DESC'
            }]
        });

        // load the routes
        var refreshRoutes = function(lat, lon) {
                socket.emit('get-routes', lat, lon, function(routes) {
                    Ext.each(routes, function(route, index) {
                        App.routeStore.add(route);
                    });
                    App.routeList.refresh();
                });
            };
        var commentData = [];
        Ext.each(rawComments, function(rawComment, index) {
            var comment = JSON.parse(rawComment);
            commentData.push({
                "date": new Date(comment.ts),
                //.format('g:i a d/h/Y'),
                "comment": comment.text
            });
        });
        App.commentStore = new Ext.data.Store({
            model: 'Comment',
            data: commentData,
            sorters: [{
                property: 'date',
                direction: 'DESC'
            }]
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
            flex: 1,
            store: App.routeStore,
            itemTpl: Ext.XTemplate.from('route-template'),
            onItemDisclosure: function (record) {
                var route_id = record.data.route + ":" + record.data.description;
                socket.emit('join-channel', route_id);
                App.panel.setActiveItem(App.form);
                
            }
        });
        App.routes = new Ext.Panel({
            title: 'routes',
            type: 'vbox',
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [
                App.routeList,
                {
                    xtype: 'panel',
                    title: 'map',
                    flex: 1,
                    html: '<div id="map"></div>'
                }
            ],
            dockedItems: [new Ext.Toolbar({
                title: '7:25 AM @ SE 50th & Division',
                dock: 'bottom',
                items: [{
                    xtype: 'spacer'
                }, {
                    xtype: "button",
                    iconMask: "true",
                    iconCls: "refresh",
                    ui: 'plain',
                    style: 'margin:0',
                    handler: function () {
                        // alert('got button');
                        // geo.updateLocation();
                    }
                }]
            })]
        });

        App.geo = new Ext.util.GeoLocation({
            autoUpdate: false,
            listeners: {
                locationupdate: function(geo) {
                    refreshRoutes(geo.latitude, geo.longitude);
                    // initialize the map on the "map" div
                    if (! App.map) {
                        App.map = new L.Map('map');
                    }
                    
                    // set the map view to a given center and zoom and add the CloudMade layer
                    App.map.setView(new L.LatLng(geo.latitude, geo.longitude), 13).addLayer(cloudmade);
                },
                locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if (bTimeout) {
                        alert('Timeout occurred.');
                    } else {
                        alert('Error occurred.');
                    }
                }
            }
        });
        
        App.geo.updateLocation();

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
            cardSwitchAnimation: {
                type: 'fade',
                duration: 200
            },

            items: [
            App.routes, App.form,
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


        
        // App.panel.getTabBar().add([{
        //     xtype: 'spacer'
        // }, {
        //     xtype: "button",
        //     iconMask: "true",
        //     iconCls: "refresh",
        //     ui: 'plain',
        //     style: 'margin:0',
        //     handler: refreshRoutes
        // }]);
        // App.panel.getTabBar().doLayout();
    }
});