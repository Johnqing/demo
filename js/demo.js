(function(){

    var globel = {
        number: 0
    };

    $('#choose').sortable({
        ghostClass: 'ghost',
        name: 'q',
        group: {
            pull: 'clone',
            put: false
        },
        sort: false,
        animation: 100,
        onEnd: function(evt){
            var node = $(evt.item);
            if(node.parents('#choose').length) return;
            node.html(NT.tpl('checkboxTmp', globel));
            globel.number++;
        }
    });

    $('#sortList').sortable({
        name: 'q',
        group: {
            pull: false,
            put: true
        },
        animation: 100
    });


    // 编辑

    var editorConfig = {};
    editorConfig.language = 'en';
    editorConfig.resize_enabled = true;
    editorConfig.removePlugins = 'elementspath';
    editorConfig.disableNativeSpellChecker = false;
    editorConfig.allowedContent = true;
    editorConfig.title = false
    editorConfig.extraPlugins = 'pbckcode';
    editorConfig.toolbarGroups = [
        {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline']
        },
        {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'BidiLtr', 'Outdent', 'Indent', 'BidiRtl', 'bidi', 'Link']
        },
        {
            name: 'insert',
            items: ['Image', 'Table', 'Iframe', 'MediaEmbed']
        },
        {
            name: "links"
        },
        {
            name: "insert"
        }, ['pbckcode']];

    editorConfig.removeButtons = 'Subscript,Superscript,Anchor,strike,magicline';
    editorConfig.extraPlugins += (editorConfig.extraPlugins.length == 0 ? '' : ',') + 'ckeditor_wiris';
    editorConfig.toolbar = editorConfig.toolbarGroups;


    function editor(){
        layer.open({
            type: 1,
            area: ['630px', '585px'],
            title: 0,
            closeBtn: 0,
            shadeClose: 0,
            skin: 'm-q-dialog',
            content: NT.tpl('dialogTmp', {})
        });
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline( 'editor01', editorConfig);
    }

    $('#sortList').on('click', 'li', function(){
        editor();
    });

    $('body').on('click', '.closeDialog', function(){
        layer.closeAll();
    });


    $('body').on('focus', '[name=add-q]', function(){
        $(this).animate({
            height: 220
        }, 200);
    });
    // $('body').on('blur', '[name=add-q]', function(){
    //     $(this).animate({
    //         height: 50
    //     }, 200);
    // });
})();
