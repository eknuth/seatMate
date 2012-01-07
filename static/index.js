Ext.setup({
    icon: 'img/icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'img/tablet_startup.png',
    phoneStartupScreen: 'img/phone_startup.png',
    onReady: function() {
        new Ext.TabPanel({
            fullscreen: true,
            type: 'dark',
            sortable: true,
            items: [{
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
