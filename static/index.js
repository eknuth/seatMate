Ext.setup({
    icon: 'img/icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    onReady: function() {
        Ext.regModel('Comment', {
            fields: [
                { name: 'comment',type: 'string' }
            ]
        });
       var formBase = {
            scroll: 'vertical',
            url   : '/postComment',
            standardSubmit : false,
            items: [{
                    xtype: 'fieldset',
                    title: 'leave a comment',
                    instructions: 'comment will be seen by other riders of the 14',
                    defaults: {
                        required: true,
                        labelAlign: 'left',
                        labelWidth: '40%'
                    },
                    items: [
                    {
                        xtype: 'textfield',
                        name : 'comment',
                        label: 'comment',
                        useClearIcon: true,
                        autoCapitalize : false
                    }]
                }],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {xtype: 'spacer'},
                        {
                            text: 'clear',
                            handler: function() {
                                form.reset();
                            }
                        },
                        {
                            text: 'comment',
                            ui: 'confirm',
                            handler: function() {
                                debugger;
                                alert(formBase.comment);

                            }
                        }
                    ]
                }
            ]
        };

        // form = new Ext.form.FormPanel(formBase);
        // form.show();
        new Ext.TabPanel({
            fullscreen: true,
            type: 'dark',
            sortable: true,
            items: [formBase,
            {
                title: 'comment',
                html: 'comment',
                cls: 'card1'
            }, {
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
