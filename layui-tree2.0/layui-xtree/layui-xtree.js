//构造
function layuiXtree(options) {
    this._container = document.getElementById(options.elem); //容器
    this._dataJson = options.data;  //数据
    this._form = options.form; //layui from对象
    this._domStr = "";  //结构字符串
    this._isopen = options.isopen != null ? options.isopen : true;
    this._color = options.color != null ? options.color : "#2F4056"; //图标颜色
    if (options.icon == null) options.icon = {};
    this._iconOpen = options.icon.open != null ? options.icon.open : ""; //打开图标
    this._iconClose = options.icon.close != null ? options.icon.close : ""; //关闭图标
    this._iconEnd = options.icon.end != null ? options.icon.end : ""; //末级图标
    this.defaultlayer = options.defaultlayer != null ? options.defaultlayer : 0;//默认展开层级
    this.treelayer=0;//层级默认最顶层为第0层
    this.clickCallback = options.onclick;    //点击回调方法
    this.dataBind(this._dataJson,this.treelayer);
    this.Rendering();
    this.openTreeByLayer(this.defaultlayer);
}

//生产结构
layuiXtree.prototype.dataBind = function (d,treelayer) {
    var _this = this;
    var childrentreelayer = treelayer
    if (d.length > 0) {
        for (i in d) {
            var xtree_isend = '';
            _this._domStr += '<div class="layui-xtree-item" treelayer=' + treelayer+ '>';
            if (d[i].data.length > 0){
                _this._domStr += '<i class="layui-icon layui-xtree-icon" data-xtree="' + (_this._isopen ? '1' : '0') + '">' + (_this._isopen ? _this._iconOpen : _this._iconClose) + '</i>';
            }else {
                _this._domStr += '<i class="layui-icon layui-xtree-icon-null" >' + _this._iconEnd + '</i>';
                xtree_isend = 'data-xend="1"';
            }
            if ( d[i].check =="true"){
            	    _this._domStr += '<input type="checkbox" class="layui-xtree-checkbox layui-form-checked" ' + xtree_isend + ' checked value="' + d[i].value + '"  title="' + d[i].title + '" lay-skin="primary" lay-filter="xtreeck">';
            }else {
            	    _this._domStr += '<input type="checkbox" class="layui-xtree-checkbox" ' + xtree_isend + ' value="' + d[i].value + '" title="' + d[i].title + '" lay-skin="primary" lay-filter="xtreeck">';
            }
             childrentreelayer=treelayer+1;
            _this.dataBind(d[i].data,childrentreelayer);
            _this._domStr += '</div>';
            
        }
    }
}

//渲染呈现
layuiXtree.prototype.Rendering = function () {
    var _this = this;
    _this._container.innerHTML = _this._domStr;
    _this._form.render('checkbox');
    var xtree_items = document.getElementsByClassName('layui-xtree-item');
    var xtree_icons = document.getElementsByClassName('layui-xtree-icon');
    var xtree_nullicons = document.getElementsByClassName('layui-xtree-icon-null');

    for (var i = 0; i < xtree_items.length; i++) {
        if (xtree_items[i].parentNode == _this._container){
            xtree_items[i].style.margin = '5px 0 0 10px';
        }else {
            xtree_items[i].style.margin = '5px 0 0 45px';
            if (!_this._isopen) xtree_items[i].style.display = 'none';
            
        }
        //xtree_items[i].style.backgroundColor  = '#f0f5cf';
          
    }
    for (var i = 0; i < xtree_icons.length; i++) {
        xtree_icons[i].style.position = "relative";
        xtree_icons[i].style.top = "1px";
        xtree_icons[i].style.margin = "0 5px 0 0";
        xtree_icons[i].style.fontSize = "18px";
        xtree_icons[i].style.color = _this._color;
        xtree_icons[i].style.cursor = "pointer";

        xtree_icons[i].onclick = function () {
            var xtree_chi = this.parentNode.childNodes;
            if (this.getAttribute('data-xtree') == 1) {
                for (var j = 0; j < xtree_chi.length; j++) {
                    if (xtree_chi[j].getAttribute('class') == 'layui-xtree-item')
                        xtree_chi[j].style.display = 'none';
                }
                this.setAttribute('data-xtree', '0')
                this.innerHTML = _this._iconClose;
            } else {
                for (var j = 0; j < xtree_chi.length; j++) {
                    if (xtree_chi[j].getAttribute('class') == 'layui-xtree-item')
                        xtree_chi[j].style.display = 'block';
                }
                this.setAttribute('data-xtree', '1')
                this.innerHTML = _this._iconOpen;
            }
        }
    }
 
    for (var i = 0; i < xtree_nullicons.length; i++) {
        xtree_nullicons[i].style.position = "relative";
        xtree_nullicons[i].style.top = "1px";
        xtree_nullicons[i].style.margin = "0 5px 0 0";
        xtree_nullicons[i].style.fontSize = "18px";
        xtree_nullicons[i].style.color = _this._color;
    }

    _this._form.on('checkbox(xtreeck)', function (da) {
        //获取当前点击复选框的容器下面的所有子级容器
        var xtree_chis = da.elem.parentNode.getElementsByClassName('layui-xtree-item');
        //遍历它们，选中状态与它们的父级一致（类似全选功能）
        for (var i = 0; i < xtree_chis.length; i++) {
            xtree_chis[i].getElementsByClassName('layui-xtree-checkbox')[0].checked = da.elem.checked;
            if (da.elem.checked) xtree_chis[i].getElementsByClassName('layui-xtree-checkbox')[0].nextSibling.classList.add('layui-form-checked');
            else xtree_chis[i].getElementsByClassName('layui-xtree-checkbox')[0].nextSibling.classList.remove('layui-form-checked');
        }
        _this.ParendCheck(da.elem);
        _this.clickCallback(da);
    });
}

//子阶段选中改变，父节点更改自身状态
layuiXtree.prototype.ParendCheck = function (ckelem) {
    var xtree_p = ckelem.parentNode.parentNode;
    console.log(ckelem)
    if (xtree_p.getAttribute('class') == 'layui-xtree-item') {
        var xtree_all = xtree_p.getElementsByClassName('layui-xtree-item');
        var xtree_count = 0;
        for (var i = 0; i < xtree_all.length; i++) {
            if (xtree_all[i].getElementsByClassName('layui-xtree-checkbox')[0].checked) {
                xtree_count++;
            }
        }
        console.log(xtree_count)
        if (xtree_count <= 0) {
            xtree_p.getElementsByClassName('layui-xtree-checkbox')[0].checked = false;
            xtree_p.getElementsByClassName('layui-xtree-checkbox')[0].nextSibling.classList.remove('layui-form-checked');
        } else {
            xtree_p.getElementsByClassName('layui-xtree-checkbox')[0].checked = true;
            xtree_p.getElementsByClassName('layui-xtree-checkbox')[0].nextSibling.classList.add('layui-form-checked');
        }
        this.ParendCheck(xtree_p.getElementsByClassName('layui-xtree-checkbox')[0]);
    }
}
//获取全部选中的末级checkbox对象
layuiXtree.prototype.GetDataAll = function () {
    var arr = new Array();
    var arrIndex = 0;
    var cks = document.getElementsByClassName('layui-xtree-checkbox');
    for (var i = 0; i < cks.length; i++) {
       
            arr[arrIndex] = cks[i]; arrIndex++;
    }
    return arr;
}
//获取全部选中的末级checkbox对象
layuiXtree.prototype.GetChecked = function () {
    var arr = new Array();
    var arrIndex = 0;
    var cks = document.getElementsByClassName('layui-xtree-checkbox');
    for (var i = 0; i < cks.length; i++) {
        if (cks[i].checked && cks[i].getAttribute('data-xend') == '1') {
            arr[arrIndex] = cks[i]; arrIndex++;
        }
    }
    return arr;
}

//全展开树
layuiXtree.prototype.openTree = function () {
    var obj = document.getElementsByClassName('layui-xtree-item');
      for (var i = 0; i < obj.length; i++) {
        obj[i].style.display="block";
        if(obj[i].getElementsByTagName("i")[0].className == "layui-icon layui-xtree-icon")
        obj[i].getElementsByTagName("i")[0].innerHTML = this._iconOpen;
	obj[i].getElementsByTagName("i")[0].setAttribute('data-xtree', '1');
    }
  
}

//全关闭
layuiXtree.prototype.closeTree = function () {
    var obj = document.getElementsByClassName('layui-xtree-item');
      for (var i = 0; i < obj.length; i++) {
      	if (obj[i].getAttribute('treelayer') == 0) {
        	obj[i].style.display="block";
        }else{
        	obj[i].style.display="none";
        }
        if(obj[i].getElementsByTagName("i")[0].className == "layui-icon layui-xtree-icon")
        obj[i].getElementsByTagName("i")[0].innerHTML = this._iconClose;
	obj[i].getElementsByTagName("i")[0].setAttribute('data-xtree', '0');
    }
}


//按层级展开树
layuiXtree.prototype.openTreeByLayer = function (l) {
	
    var obj = document.getElementsByClassName('layui-xtree-item');
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].getAttribute('treelayer') <= l) {
        	obj[i].style.display="block";
        	if(i>0&&obj[i-1].getElementsByTagName("i")[0].className == "layui-icon layui-xtree-icon"){
        	        	obj[i-1].getElementsByTagName("i")[0].setAttribute('data-xtree', '1');
        	        	obj[i-1].getElementsByTagName("i")[0].innerHTML = this._iconOpen;
        	}

        }else{
        	obj[i].style.display="none";
        	if(i>0&&obj[i-1].getElementsByTagName("i")[0].className == "layui-icon layui-xtree-icon"){
        	        	obj[i-1].getElementsByTagName("i")[0].setAttribute('data-xtree', '0');    
        	        	obj[i-1].getElementsByTagName("i")[0].innerHTML = this._iconClose;
        	}

        }
    }
    
    
}