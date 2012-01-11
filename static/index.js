var App = new Ext.Application({
    name: "seatMate"
});

Ext.setup({
    icon: 'img/icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    onReady: function() {
        App.models.Comment = Ext.regModel('Comment', {
            fields: [{
                name: 'from_user',
                type: 'string'
            },
            {
                name: 'comment',
                type: 'string'
            },
            {
                name: 'profile_image_url',
                type: 'string'
            }],
            proxy:
            {
                type: 'localstorage',
                id: 'comments'
            }
            
        });
        
        Ext.regController('Comment', {
            submitComment: function (param) {
                console.log(param.data.comment);
           }
        });
        var commentData = [{
            "from_user": "hipster trash",
            "comment": "My stop was closed :(",
            "profile_image_url": "http://placekitten.com/48/48"
        }, {
            "from_user": "funky redhead",
            "comment": "I think the bridge is up?",
            "profile_image_url": "http://placekitten.com/48/48"
        }, {
            "from_user": "smokin' grannie",
            "comment": "What a beautiful day!",
            "profile_image_url": "http://placekitten.com/48/48"
        }];
        var comments = new Ext.Component({
            title: 'Comments',
            cls: 'timeline',
            scroll: 'vertical',
            tpl: ['<tpl for=".">', '<div class="tweet">', '<div class="avatar"><img src="{profile_image_url}" /></div>', '<div class="tweet-content">', '<h2>{from_user}</h2>', '<p>{comment}</p>', '</div>', '</div>', '</tpl>']
        });

        comments.update(commentData);

        App.form = new Ext.form.FormPanel({
            title: 'comment',
            scroll: 'vertical',
            url: '/postComment',
            standardSubmit: false,
            items: [
            comments,
            {
                xtype: 'fieldset',
                title: 'leave a comment',
                instructions: 'comment will be seen by other riders of the 14',
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
                                                
                        // form.submit({
                        //     waitMsg : {message:'Submitting', cls : 'demos-loading'}
                        // });
                    }
                }]
            }]
        });
        // form.show();
        new Ext.TabPanel({
            fullscreen: true,
            type: 'dark',
            sortable: true,
            items: [App.form,
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
    }
});