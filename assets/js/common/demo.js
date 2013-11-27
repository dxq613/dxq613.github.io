/**
 * @fileOverview 显示Demo
 * @ignore
 */

define('common/demo',['bui/common','bui/toolbar','bui/overlay'],function (require) {
  var BUI = require('bui/common'),
    Toolbar = require('bui/toolbar'),
    Overlay = require('bui/overlay'),
    Dialog = Overlay.Dialog;

  //初始化dialog
  function getShareDialog(){
    var _self = this;
    if(!Demo.dialog){
      Demo.dialog = new Dialog({
        title : 'Demo',
        elCls:'demo-dialog',
        width:800,
        height:500
      });
    }
    return Demo.dialog;
  }

  /**
   * @class Demo
   * 处理demo
   */
  var Demo = BUI.Component.Controller.extend({
    //渲染控件
    renderUI : function(){
      var _self = this,
        tpl = _self.get('tpl'),
        el = _self.get('el'),
        toolbar = _self.get('tbar');
      $(tpl).appendTo(el);
      toolbar.render = _self.get('el').find('.panel-header');
      toolbar = new Toolbar.Bar(toolbar);
      toolbar.render();
      _self.set('tbar',toolbar);

    },
    //绑定事件
    bindUI : function(){
      var _self = this,
        toolbar = _self.get('tbar');
      toolbar.on('click',function(ev){
        var item = ev.target,
          type = item.get('type');
        if(type == 'run'){
          _self.run();
        }else if(type == 'source'){
          _self.showSource();
        }
      });
    },
    /**
     * 获取源码
     */
    fetchSource : function(){
      var _self = this,
        redirectUrl  = _self.get('redirectUrl'),
        url = _self.get('url');
        
      $.ajax({
        dataType : 'jsonp',
        url : redirectUrl,
        data : {file : url},
        success : function(text){
          _self.set('source',text);
          //_self.showSource();
        },
        error : function(xhr,status,msg){

        }
      });
    },
    /**
     * 执行源码
     */
    run : function(){
      var _self = this,
        dialog = _self.get('dialog'),
        runTpl = _self.get('runTpl'),
        url = _self.get('url');
      runTpl = BUI.substitute(runTpl,{src : url});
      dialog.set('bodyContent',runTpl);
      dialog.show();
    },
    /**
     * 显示脚本代码
     */
    showScriptCode : function(){
      var _self = this,
        el = _self.get('el'),
        code = _self.getScriptCode(),
        scriptEl = el.find('.panel-body');
      code = code.replace(/\\/ig,'<br/>');
      scriptEl.html(code);
      if(window.prettyPrintEl){
        prettyPrintEl(scriptEl[0]);
      }
    },
    /**
     * 获取脚本代码
     * @return {String} 脚本代码
     */
    getScriptCode : function(source){
      var _self = this,
        beginTag = _self.get('beginTag'),
        endTag = _self.get('endTag'),
        index;
      source = source || _self.get('source');
      index = source.indexOf(beginTag);
      source = source.substring(index + beginTag.length);
      index = source.lastIndexOf(endTag);
      if(index !== -1){
        source = source.substring(0,index);
      }
      
      return source;
    },
    /**
     * 显示源码
     */
    showSource : function(){
      var _self = this,
        source = _self.get('source'),
        dialog = _self.get('dialog'),
        sourceTpl = _self.get('sourceTpl'),
        sourceEl = $(sourceTpl);
      dialog.set('bodyContent',sourceEl);
      sourceEl.html(source);
      dialog.show();
    },
    //设置源码
    _uiSetSource : function(v){
      var _self = this;
      _self.showScriptCode(v);
    }
  },{
    //共享的弹出框
    _dialog : null,
    ATTRS : {

      /**
       * 将页面转成jsonp的网址
       * @type {Object}
       */
      redirectUrl : {
        value : "http://www.builive.com/fetchdemo.php"
      },
      /**
       * 显示代码源码，以及效果
       * @type {BUI.Overlay.Dailog}
       */
      dialog : {
        getter : function(){
          return getShareDialog();
        }
      },
      /**
       * 显示代码的开始标志
       * @type {String}
       */
      beginTag : {
        value : '&lt;!-- script start--&gt;  \n'
      },
      /**
       * 显示代码的结束标志
       * @type {String}
       */
      endTag : {
        value : '&lt;!-- script end --&gt;'
      },
      /**
       * @private
       */
      sourceTpl : {
        value : '<textarea></textarea>'
      },
      /**
       * @private
       */
      runTpl : {
        value : '<iframe width="100%" height="100%" src="{src}" frameborder="0"></iframe>'
      },
      /**
       * 源码
       * @type {String}
       */
      source : {

      },
      /**
       * 加载demo的url
       * @type {String}
       */
      url : {

      },
      /**
       * 工具栏
       * @type {Object}
       */
      tbar : {
        value : {
          elCls : 'button-group pull-right',
          defaultChildCfg : {
            elCls : 'button button-small'
          },
          children : [
            {content : '运行',type:'run'},
            {content : '源码',type:'source'}
          ]
        }
      },
      tpl : {
        value : '<div class="panel"><div class="panel-header">代码示例</div><pre class="panel-body"></pre></div>'
      }
    }
  },{
    xclass : 'demo'
  });

  return Demo;
});