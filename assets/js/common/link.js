/**
 * @fileOverview 链接处理
 * @ignore
 */

define('common/link',['bui/common'],function (require) {

  var BUI = require('bui/common');

  var CLS_ACTION = 'page-action',
    FIELD_MAP = {
      'data-id' :'id',
      'title' : 'title',
      'data-href' : 'href',
      'data-close' : 'isClose',
      'data-search' : 'search',
      'data-type' : 'type'
    };
  function parseParams(attrs){
    var rst = {};
    $.each(attrs,function(index,attr){
      var name = attr.nodeName,
        filedName = FIELD_MAP[name];
      if(filedName){
        rst[filedName] = attr.nodeValue;
      }
    });
    return rst;
  }
  /**
   * @class Link
   * 链接处理
   */
  var Link = function(config){
    Link.superclass.constructor.call(this,config);
  };

  Link.ATTRS = {
    linkCls : {
      value : 'page-action'
    }
  };

  BUI.extend(Link,BUI.Base);

  BUI.augment(Link,{
    init : function(){
      this._initEvent();
    },
    _initEvent : function(){
      var _self = this,
        linkCls = _self.get('linkCls');
      if(top.topManager){
        $(document).delegate('.' + linkCls,'click',function(ev){
          var sender = ev.currentTarget,
            attrs = sender.attributes,
            params = parseParams(attrs);
          if(!params.type || params.type == 'open'){
            top.topManager.openPage(params);
            ev.preventDefault();
          }else if(params.type == 'setTitle'){
            top.topManager.setPageTitle(params.title);
          }else{
            ev.preventDefault();
            top.topManager.operatePage(params.id,params.type);
          }
        });
      }
    }
  });

  return Link;
});