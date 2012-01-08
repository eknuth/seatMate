Ext.setup({
    icon: 'img/icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    onReady: function() {
        Ext.regModel('Comment', {
            fields: [{
                name: 'comment',
                type: 'string'
            }]
        });
        var comments = [{
          "from_user": "hipster trash",
          "text": "what's up?",
          "profile_image_url": "http://placekitten.com/48/48"
        }];
        var timeline = new Ext.Component({
            title: 'Timeline',
            cls: 'timeline',
            scroll: 'vertical',
            tpl: ['<tpl for=".">',
                    '<div class="tweet">',
                    '<div class="avatar"><img src="{profile_image_url}" /></div>',
                    '<div class="tweet-content">',
                    '<h2>{from_user}</h2>',
                    '<p>{text}</p>',
                    '</div>', '</div>', '</tpl>']
        });
        timeline.update(comments);
        var formBase = {
            title: 'comment',
            scroll: 'vertical',
            url: '/postComment',
            standardSubmit: false,
            items: [
                timeline,
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
                    text: 'comment',
                    ui: 'confirm',
                    handler: function() {
                        alert(formBase.comment);
                    }
                }]
            }]
        };

        // form = new Ext.form.FormPanel(formBase);
        // form.show();
        new Ext.TabPanel({
            fullscreen: true,
            type: 'dark',
            sortable: true,
            items: [formBase,
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