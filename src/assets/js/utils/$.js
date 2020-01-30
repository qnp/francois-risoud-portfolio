/*
 * slightly modified version of https://github.com/remy/min.js
 * todo: make a pull request ?
 */

const $ = (function (document, window, $) {
  // Node covers all elements, but also the document objects
  const NodeAlias = Node;
  const NodeListAlias = NodeList;
  const node = NodeAlias.prototype;
  const nodeList = NodeListAlias.prototype;
  const keys = Object.keys;
  const forEach = 'forEach';
  const trigger = 'trigger';
  const each = [][forEach];
  // note: createElement requires a string in Firefox
  const dummy = document.createElement('i');

  nodeList[forEach] = each;

  // we have to explicitly add a window.on as it's not included
  // in the Node object.
  window.on = node.on = function (arg1, arg2, arg3) {
    const _this = this;
    if (typeof arg1 === 'object') {
      keys(arg1)[forEach](function(event) {
        _this.addEventListener(event, arg1[event], arg2);
      });
    } else {
      _this.addEventListener(arg1, arg2, arg3);
    }
    // allow for chaining
    return _this;
  };

  nodeList.on = function (arg1, arg2, arg3) {
    this[forEach](function (el) {
      el.on(arg1, arg2, arg3);
    });
    return this;
  };

  // we have to explicitly add a window.off as it's not included
  // in the Node object.
  window.off = node.off = function (arg1, arg2, arg3) {
    const _this = this;
    if (typeof arg1 === 'object') {
      keys(arg1)[forEach](function(event) {
        _this.removeEventListener(event, arg1[event], arg2);
      });
    } else {
      _this.removeEventListener(arg1, arg2, arg3);
    }
    // allow for chaining
    return _this;
  };

  nodeList.off = function (arg1, arg2, arg3) {
    this[forEach](function (el) {
      el.off(arg1, arg2, arg3);
    });
    return this;
  };

  // we save a few bytes (but none really in compression)
  // by using [trigger] - really it's for consistency in the
  // source code.
  window[trigger] = node[trigger] = function (type, data) {
    // construct an HTML event. This could have
    // been a real custom event
    const event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    event.data = data || {};
    event.eventName = type;
    // event.target = this;
    this.dispatchEvent(event);
    return this;
  };

  nodeList[trigger] = function (event) {
    this[forEach](function (el) {
      el[trigger](event);
    });
    return this;
  };

  $ = function (s) {
    var r;
    // if s is instanceof Document, Window, Node or NodeList
    if (s instanceof Document || s instanceof Window || s instanceof NodeAlias || s instanceof NodeListAlias) r = s;
    // querySelectorAll requires a string with a length
    // otherwise it throws an exception
    else r = document.querySelectorAll(s || '☺');
    const length = r.length;
    // if we have a single element, just return that.
    // if there's no matched elements, return a nodeList to chain from
    // else return the NodeList collection from qSA
    return length === 1 ? r[0] : r;
  };

  // $.on and $.trigger allow for pub/sub type global
  // custom events.
  $.on = node.on.bind(dummy);
  $[trigger] = node[trigger].bind(dummy);

  return $;

})(document, window);

export default $;
