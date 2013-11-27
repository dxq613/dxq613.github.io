/**
 * @fileOverview  页面操作
 * @ignore
 */

define('common/page',['bui/common','common/link','bui/menu','common/demo','common/api'],function (require) {
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
    api: {
      value : '.J_API'
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
        apis = [],
        nodes = $(_self.get('api'));
      BUI.each(nodes,function(node){
        var _self = this,
        api = new API({
          srcNode : node
        });
        api.render();
        apis.push(api);
      });
      _self.set('apis',apis);
    },
    _isHasAPI : function(){
      return $(this.get('api')).length;
    },
    //创建demo对象
    _initDemos : function(){
      var _self = this,
        demos = _self.get('demos'),
        demoCls = _self.get('demoCls');
      $('.' + demoCls).each(function(index,node){
        var demo = new Demo({
          srcNode : node
        });
        //demo.render();
        //demo.fetchSource();
        demos.push(demo);
      });
      if(demos.length){
        _self._renderDemos(demos);
      }
    },
    //获取未加载的demo
    _getUnloadDemos : function(){
      var _self = this,
        demos = _self.get('demos'),
        rst = [];
      BUI.each(demos,function(demo){
        if(!demo.get('rendered')){
          rst.push(demo);
        }
      });
      return rst;
    },
    //渲染示例
    _renderDemos : function(demos){
      var _self = this;

      BUI.each(demos,function(demo){
        if(!demo.get('rendered')){
          var el = demo.get('srcNode');
          if(BUI.isInVerticalView(el.offset().top)){
            demo.render();
            demo.fetchSource();
          }
        }
      });
    },
    //初始化导航菜单
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
      _self.set('menu',menu);
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
      /**/
      if(window.prettyPrint){
        prettyPrint();
      }
    },
    //初始化事件
    _initEvent : function(){
      var _self = this;

      $(window).on('unload',function(){
        _self.destroy();
      });

      function callback(){
        var demos = _self._getUnloadDemos();
        if(!demos.length){
          $(window).off('scroll',callback);
        }else{
          _self._renderDemos(demos);
        }
      }

      $(window).on('scroll',callback);
    },
    /**
     * 页面释放
     */
    destroy : function(){
      var _self = this,
        demos = _self.get('demos'),
        menu = _self.get('menu'),
        apis = _self.get('apis');

      BUI.each(demos,function(demo){
        demo.destroy();
      });

      BUI.each(apis,function(api){
        api.destroy();
      });
      menu.destroy();
      _self.clearAttrVals();
    }
  });

  return Page;
});