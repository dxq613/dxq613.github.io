/**
 * @fileOverview 获取API文档,利用JSduck生成的文档
 * @ignore
 */

define('common/api',['bui/common'],function(require) {
  var BUI = require('bui/common'),
   CLS_PRETTY = 'prettyprint linenums';

  window.Ext = {
    data:{
      JsonP:{
        
      }
    }
    
  };
  /**
   * @class Common.API
   * 加载显示API
   */
  var Api = BUI.Component.Controller.extend({
    renderUI : function(){
      this._createCallback();
      this.fetchAPI();
    },
    _createCallback : function(){
      var _self = this,
        name = _self.get('name');
      Ext.data.JsonP[name.replace(/\./ig,'_')] = function(data){
        _self.showApi(data);
      };
    },
    fetchAPI : function(){
      var _self = this,
        url = _self.get('url');
      $.ajax({
        url : url,
        dataType : 'jsonp'
      });
    },
    showApi : function(data){
      var _self = this,
        html = data.html;
      _self.set('content',html);
      _self._appendTables();
      _self.replaceLink();
      _self.hideMembers();
      _self.prettyPrint();
    },
    //附加表头
    _appendTables :function(){
      var _self = this,
        tableTpl = _self.get('tableTpl'),
        el = _self.get('el');

      $(tableTpl).insertAfter(el.find('.members-title'));
    },
    //替换链接
    replaceLink : function(){
      var _self = this,
        el = _self.get('el'),
        docsUrl = _self.get('docsUrl'),
        links = el.find('a.name');

      BUI.each(links,function(link){
        var linkEl = $(link),
          href = linkEl.attr('href');
        linkEl.attr('target','_blank');
        linkEl.attr('href',docsUrl + href);
      });
    },
    //隐藏protected,prive
    hideMembers : function(){
      var _self = this,
        el = _self.get('el'),
        hides = el.find('.private,.protected');
      hides.parents('.not-inherited').hide();
    },
    prettyPrint : function(){
      var el = this.get('el'),
        pres = el.find('pre');
      pres.addClass(CLS_PRETTY);

      if(window.prettyPrintEl){
        pres.each(function(index,element){
          var node = $(element).find('node');
          $(element).html(node.html());
          prettyPrintEl(element);
        });
      }
    }
  },{
    ATTRS : {
      /**
       * @private
       * API数据
       * @type {Object}
       */
      data : {

      },
      tableTpl : {
        value : '<table cellspacing="0" class="table table-bordered">\
          <thead>\
            <tr>\
              <th width="242px">名称</th>\
              <th>简介</th>\
            </tr>\
          </thead>\
        </table>'
      },
      /**
       * 请求API的根路径
       * @type {String}
       */
      baseUrl : {
        value : 'http://www.builive.com/docs/output/'
      },
      /**
       * 在线详细API的地址
       * @type {Object}
       */
      docsUrl : {
        value : "http://www.builive.com/docs"
      },
      /**
       * API的类名称
       * @type {String}
       */
      name : {

      },
      /**
       * 请求API的路径，baseUrl + name + .js
       * @type {String}
       */
      url: {
        getter : function(v){
          if(!v){
            return this.get('baseUrl') + this.get('name') + '.js';
          }
        }
      }
    }
  },{
    xclass : 'api'
  });

  return Api;

});