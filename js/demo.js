(function(){

    var globel = {
        number: 0,
        saveData: {}
    };

    var defaultOption = function(id){
        return {
            id: id || globel.number,
            editor01: '下列说法哪种你认为是正确的？',
            option: '说法1|说法2|说法3|说法4',
            check: '0|0|0|0'
        }
    }

    var formMehod = {
        /**
         * 获取元素的 value
         * @param el
         * @returns {*}
         */
        elValue: function(el){
            el = $(el);
            var type = el.attr("type"),
                val = $.trim(el.val()).replace(/\s/g, '');

            if (type === "radio" || type === "checkbox") {
                return $("input[name='" + el.attr("name") + "']:checked").val();
            }
            if (typeof val === "string") {
                return val.replace(/\r/g, "");
            }
            return val;
        },
        /**
         * 检查是否为checkbox/radio
         * @param el
         * @returns {boolean}
         */
        checkable: function(el){
            return /radio|checkbox/i.test(el[0].type);
        },
        /**
         * 获取length
         * @param el
         * @returns {Number|jQuery}
         */
        getLength: function(el){
            return $(el).filter(":checked").length;
        },
        /**
         * 表单数据提取
         * @param nodeChilds
         * @param prefix 加密前缀
         * @returns {string}
         */
        serialize: function(nodeChilds, prefix){
            var data = {};
            var fm = formMehod;
            $.each(nodeChilds, function(){
                var $this = $(this),
                    ignore = $this.data('ignore'),
                    name = $this.attr('name'),
                    value = fm.elValue($this);

                if(ignore || !name) return;


                if(data[name]){
                    data[name] += '|' + value;
                    return;
                }

                data[name] = value;

            });

            return data;
        }
    }

    function init(){
        var sortNode = $('#sortList');
        for(var i=0;i<3; i++){
            globel.number++;
            var html = NT.tpl('checkboxTmp', defaultOption());
            var node = $('<li>'+html+'</li>');
            sortNode.append(node);
            node.attr('data-number', globel.number);
        }


    }

    init();

    function sortNumber(){
        var liNode = $('#sortList').find('li');
        for(var i=0; i<liNode.length; i++){
            liNode.eq(i).find('h3 em').text(i+1);
        }
    }


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
            globel.number++;
            node.html(NT.tpl('checkboxTmp', defaultOption()));
            node.data('number', globel.number);
            sortNumber(node);
        }
    });

    $('#sortList').sortable({
        name: 'q',
        group: {
            pull: false,
            put: true
        },
        animation: 100,
        onEnd: function(evt){
            sortNumber($(evt.item))
        }
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

    function CKupdate() {
        for (var instance in CKEDITOR.instances)
            CKEDITOR.instances[instance].updateElement();
    }


    function editor(n){
        layer.open({
            type: 1,
            area: ['630px', '585px'],
            title: 0,
            closeBtn: 0,
            shadeClose: 0,
            skin: 'm-q-dialog',
            content: NT.tpl('dialogTmp', globel.saveData[n] || defaultOption(n))
        });
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline( 'editor01', editorConfig);
    }

    $('#sortList').on('click', '.m-ct', function(){
        var n = $(this).parents('li').attr('data-number');
        editor(n);
    });

    $('#sortList').on('click', '.u-i-del', function(){
        var node = $(this).parents('li');
        var n = node.attr('data-number');
        delete globel.saveData[n];
        node.remove();
        sortNumber();
    });

    $('#sortList').on('click', '.u-i-cp', function(){
        var node = $(this).parents('li');
        var cnode = node.clone();
        globel.number++;
        node.after(cnode);
        cnode.attr('data-number', globel.number);
        sortNumber();
    });

    // dialog

    $('body').on('click', '.closeDialog', function(){
        layer.closeAll();
    });
    $('body').on('click', '.mcb', function(){
        var node = $(this).find('input');

        if(!node.length){
            node = $('<input type="hidden" name="check" value="0" />');
            $(this).append(node);
        }

        if($(this).hasClass('mcb-select')){
            node.val(0);
            $(this).removeClass('mcb-select');
            return
        }
        node.val(1);
        $(this).addClass('mcb-select');
    });


    $('body').on('focus', '[name=add-q]', function(){
        $(this).animate({
            height: 220
        }, 200);
        $(this).parent().find('.m-sub-btn').removeClass('hide');
    });
    $('body').on('click', '.batch-cancel', function(){
        addOptionClear();
    });


    function addOptionClear(){
        $('.add-q-a').find('.m-sub-btn').addClass('hide');
        $('[name=add-q]').animate({
            height: 50
        }, 200);
    }

    function updateOption(data){
        var result = NT.tpl('optionTmp', {
            data: data
        })
        return result
    }

    $('body').on('click', '.batch-update', function(){
        var texNode = $(this).parents('.add-q-a').find('.tex');
        var value = texNode.val();
        if(!value) return;

        var optionVal = value.split(/\n/);
        var html = updateOption(optionVal);
        $('.q-a-box').html(html);
        addOptionClear();
    });

    $('body').on('click', '.u-i-reduce', function(){
        $(this).parents('.m-row').remove();
    });
    $('body').on('click', '.u-i-add', function(){
        var node = $(this).parents('.m-row');
        var cnode = node.clone();
        node.after(cnode);
    });

    $('body').on('click', '.other a', function(){
        var node = $(this).parent();
        if(node.hasClass('none'))
            return node.removeClass('none');
        node.addClass('none');
    });

    // 提交
    $('body').on('click', '.subBtn', function(){
        var node = $(this).parents('.layui-layer-content');
        CKupdate();
        var data = formMehod.serialize(node.find(':input'));
        globel.saveData[data.id] = data;
        layer.closeAll();
        var result = NT.tpl('checkboxTmp', data);
        $('[data-number='+data.id+']').html(result);
    });



})();
