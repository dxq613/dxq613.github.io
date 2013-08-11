/**
 * @fileOverview  页面操作
 * @ignore
 */

define('common/page',function (require) {
  var BUI = require('bui/common'),
    Link = require('common/link'),
    Menu = require('bui/menu'),
    Demo = require('common/demo'),
    API = require('common/api'),
    CLS_PRETTY = 'prettyprint linenums'; //优化显示代码

  /**
   * @class Page
   * 页面操作类
   */
  var Page = function(config){
    Page.superclass.constructor.call(this,config);
  };

  Page.ATTRS = {

    linkCls : {
      
    },
    apiId : {
      value : 'J_API'
    },
    /**
     * 创建demo的样式
     * @type {String}
     */
    demoCls : {
      value : 'page-demo'
    },
    /**
     * @private
     * 存储demo对象
     */
    demos : {
      value : []
    }
  };

  BUI.extend(Page,BUI.Base);

  BUI.augment(Page,{

    /**
     * 初始化
     */
    init : function(){
      this._initDom();
      this._initEvent();
    },
    //初始化DOM 
    _initDom : function(){
      this._initLinks();
      this._initDemos();
      this._initNavMenu();
      this._initPretty();
      this._initAPI();
    },
    _initAPI : function(){
      if(!this._isHasAPI()){
        return;
      }
      var _self = this,
        api = new API({
          srcNode : '#J_API'
        });
      api.render();
    },
    _isHasAPI : function(){
      return $('#J_API').length;
    },
    //创建demo对象
    _initDemos : function(){
      var _self = this,
        demoCls = _self.get('demoCls');
      $('.' + demoCls).each(function(index,node){
        var demo = new Demo({
          srcNode : node,
          autoRender : true
        });
        _self.get('demos').push(demo);
      });
    },
    _initNavMenu : function(){
      var _self = this,
        hEls = $('h2,h3'),
        menus = [];
      hEls.each(function(index,dom){
        var el = $(dom),
          id = el.attr('id'),
          type = el.is('h2') ? 'h2' : 'h3';
        if(!id){
          id = 'h' + index;
          el.attr('id',id);
        }
        menus.push({id : id,href:'#' + id,text : el.text(),type : type});
      });
      var menu = new Menu.Menu({
        render : 'body',
        elCls : 'nav-menu',
        itemTpl : '<a class="{type}" href="{href}">{text}</a>',
        children : menus
      });
      menu.render();
    },
    _initLinks : function(){
      var _self = this,
        link = new Link();
      link.init();
      _self.set('link',link);
    },
    _initPretty : function(container){
      var preEls =  $('pre');
      BUI.each(preEls,function(el){
        var node = $(el),
          textEl = node.children('textarea'),
          innerText; //如果存在textarea子标签
        node.addClass(CLS_PRETTY);
        if(textEl.length){
          innerText = textEl.html();
        }else{
          innerText = node.html();
        }
        var a = /^(\s+)/.exec(innerText),
          regex;
        if(a){
          regex = new RegExp('('+a[0]+')(\\s*)','ig');
          innerText = innerText.replace(regex,'$2');
        }
        
        node.html(innerText);
      });
      if(!this._isHasAPI() && window.prettyPrint){
        prettyPrint();
      }
    },
    //初始化事件
    _initEvent : function(){

    }
  });

  return Page;
});