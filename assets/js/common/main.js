/**
 * @fileOverview 主页的控制逻辑
 * @author dxq613@gmail.com
 * @ignore
 */

define('common/main',['bui/common','bui/tree','bui/tab'],function (require) {
  var win = window,
    BUI = require('bui/common'),
    Tree = require('bui/tree'),
    Tab = require('bui/tab');

  function setTopManager(mainPageObj){
    window.topManager = mainPageObj;
  }

  function addSearch(href,search){
    if(href.indexOf('?') !== -1){
      return href + '&' + search;
    }else{
      return href + '?' + search;
    }
  }

   //更改地址栏连接
  function setNavPosition(pageId){
    pageId = pageId||'';

    var str = '#' + pageId;

    location.hash = str;
  }

  function getNavPositionSetting(){
    var pos = location.hash,
      pageId ='',
      splitIndex = pos.lastIndexOf('/'),
      search = null;
    if(!pos){
      return null;
    }
    pageId = pos.replace('#','');
    if(splitIndex >= 0){
      pageId = pos.substring(splitIndex + 1);
    }
    search = getParam(pageId);
    if(search){
      pageId = pageId.replace('?'+search,'');
    }

    return {pageId : pageId,search : search};
  }

  function getParam(pageId){
    var index = pageId.indexOf('?');
    if(index >= 0){
      return pageId.substring(index + 1);
    }
    return null;
  }


  /**
   * @class Main
   * 主页控制逻辑类
   */
  var Main = function(config){
    Main.superclass.constructor.call(this,config);
    setTopManager(this);
  };

  Main.ATTRS = {
    header : {
      valueFn : function(){
        return $('#header');
      }
    },
    content : {
      valueFn : function(){
        return $('#content');
      }
    },
    footer : {
      valueFn : function(){
        return $('#footer');
      }
    },
    /**
     * 首页id
     * @type {String}
     */
    homePage : {

    },
    /**
     * 页面的后缀
     * @type {String}
     */
    urlSuffix : {
      value : 'html'
    },
    /**
     * 菜单配置
     * @type {Array}
     */
    menus : {

    },
    /**
     * 目录树
     * @type {Object}
     */
    tree : {

    },
    /**
     * 切换标签
     * @type {Object}
     */
    tab : {

    }
  };

  BUI.extend(Main,BUI.Base);

  BUI.augment(Main,{
    /**
     * 打开页面
     * @param  {Object} info 页面信息
     * @param {String} info.id 页面id
     * @param {String} info.title 信息的title
     * @param {String} info.href 页面地址
     * @param {Boolean} info.isClose 打开新页面后，是否关闭当前页面
     * @param {Boolean} info.closeable 页面是否可以关闭
     * @param {Boolean} info.reload 页面如果已经打开，是否刷新页面
     * @param {String} info.search 打开页面需要的参数 ?a=1&b=2
     */
    openPage : function(pageInfo){

      pageInfo.title = pageInfo.title || '新的标签页';
      var _self = this,
        reload = pageInfo.reload,
        tab = _self.get('tab'),
        tree = _self.get('tree'),
        treeItem = tree.findNode(pageInfo.id),
        curTabPage = tab.getActivedItem();/*,
        sourceId = curTabPage ? curTabPage.get('id') : null;*/
      if(treeItem){
        _self._setPageSelected(pageInfo.id,reload,pageInfo.search);
      }else{
        tab.addTab(pageInfo,reload);
      }
      
      if( pageInfo.isClose){
        curTabPage.close();
      }
      
    },
    /**
     * 关闭页面
     * @param  {String} id 页面id,可以为空，默认为当前页面
     */
    closePage:function(id){
      this.operatePage(id,'close');
    },
    //刷新
    /**
     * 刷新页面
     * @param  {String} id 页面id,可以为空，默认为当前页面
     */
    reloadPage : function(id){
      this.operatePage(id,'reload');
    },
    /**
     * 更改标题
     * @param  {String} title 页面标题
     * @param  {String} id 页面id,可以为空，默认为当前页面
     */
    setPageTitle : function(title,id){
      this.operatePage(id,'setTitle',[title]);
    },
    /**
     * 操作页面
     * @param  {String} id  页面id
     * @param  {String} action 操作名称
     * @param  {Array} args 操作参数，可以为空
     */
    operatePage : function(id,action,args){
      args = args || [];
      var _self = this,
        tab = _self.get('tab'),
        item = id ? tab.getItemById(id) : tab.getActivedItem();

      if(item && item[action]){
        item[action].apply(item,args);
      }
    },
    //初始化
    init : function(){
      this._initDom();
      this._initEvent();
    },
    //初始化DOM
    _initDom : function(){
      this.autoFitHeight();
      this._initTree();
      this._initTab();
      this._initHomePage();
      this._initNavPos();
    },
    //初始化tree
    _initTree : function(){
      var _self = this,
        menus = _self.get('menus'),
        tree = new Tree.TreeList({
          render: '#J_Tree',
          accordion : true,
          expandAnimate : true,
          expandEvent : 'itemclick', //单击展开节点
          collapseEvent : 'itemclick',
          nodes : menus
        });
      tree.render();
      _self.set('tree',tree);
    },
    //初始化标签
    _initTab : function(){
      var _self = this,
        tab = new Tab.NavTab({
          render : '#J_Tab'
        });
      tab.render();
      _self.set('tab',tab);
    },
    _initHomePage : function(){
      var _self = this,
        homePage = _self.get('homePage');
      if(homePage){
        _self._setPageSelected(homePage);
      }
    },
    //初始化导航位置
    _initNavPos : function(){
      var _self = this,
        info = getNavPositionSetting();
      if(info){
        _self._setPageSelected(info.pageId,true,info.search);
      }
    },
    //初始化事件
    _initEvent : function(){
      this._initResizeEvent();
      this._initNavEvent();
    },
    //初始化tree和tab的事件
    _initNavEvent : function(){
      var _self = this,
        tree = _self.get('tree'),
        tab = _self.get('tab');

      tree.on('itemclick',function(ev){
        var node = ev.item;

        if(node.leaf){
          _self._openPage(node,true);
        }
      });

      //选中的菜单发生改变后，更新链接上的页面编号
      tree.on('itemselected',function(ev){   
        var item = ev.item; 
        if(item){
          setNavPosition(item.id);
        }    
      });

      tab.on('activeChange',function(ev){
        var item = ev.item,
          node;
        if(item){
          node = tree.findNode(item.get('id'));
          tree.expandNode(node);
          tree.setSelected(node);
        }else{
          tree.clearSelection();
        }
      });

    },
    //初始化窗口变化事件
    _initResizeEvent : function(){
      var _self = this;
      $(win).on('resize',function(){
        _self.autoFitHeight();
      });
    },
    /**
     * 自动调整content高度
     */
    autoFitHeight : function(){
      var _self = this,
        headerEl = _self.get('header'),
        footerEl = _self.get('footer'),
        contentEl = _self.get('content'),
        winHeight = BUI.viewportHeight();
      contentEl.height(winHeight - footerEl.height() - headerEl.height());
    },
    //获取节点代表的页面地址
    _getNodeHref : function (node){
      var _self = this,
        path = node.path.join('/');
      if(path.indexOf('/') == 0){
        path = path.substring(1);
      }
      return path +'.' + _self.get('urlSuffix');
    },
    //设置节点选中
    _setPageSelected : function(pageId,isReload,search){
      var _self = this,
        tree = _self.get('tree'),
        tab = _self.get('tab'),
        node = tree.findNode(pageId),
        href = '',
        suffixIndex = -1;
      if(node){
        tree.expandNode(node);
        tree.setSelected(node);
        _self._openPage(node,isReload,search);

      }else if(pageId){

        var subDir = pageId.replace('-','/');

        if((suffixIndex = pageId.indexOf('.')) === -1){
          subDir += _self.get('urlSuffix');
        }
        href = search ? (subDir + '?' + search) : subDir;
        tab.addTab({id:pageId,title:'',href:href},!!isReload);
      }
    },
    _openPage : function(node,isReload,search){
      var _self = this,
        tab = _self.get('tab'),
        tree = _self.get('tree'),
        href = node.href || _self._getNodeHref(node);
      if(node.leaf){
        href = search ? (addSearch(href,search)) : href;
        tab.addTab({id: node.id, title: node.text,closeable : node.closeable, href: href},!!isReload);
      }else{
        tree.expandNode(node);
      }
      
    }

  });
  return Main;
});
