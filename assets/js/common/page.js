/**
 * @fileOverview  页面操作
 * @ignore
 */

define('common/page',function (require) {
  var BUI = require('bui/common'),
    Link = require('common/link'),
    Demo = require('common/demo');

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
    },
    //创建demo对象
    _initDemos : function(){
      var _self = this,
        demoCls = _self.get('demoCls');
      $('.' + demoCls).each(function(node){
        var demo = new Demo({
          srcNode : node,
          autoRender : true
        });
        _self.get('demos').push(demo);
      });
    },
    _initNavMenu : function(){
      var _self = this,
        hEls = $('h2,h3');
      hEls.each(function(el){
        
      });
    },
    _initLinks : function(){
      var _self = this,
        link = new Link();
      link.init();
      _self.set('link',link);
    },
    //初始化事件
    _initEvent : function(){

    }
  });

  return Page;
});