/**
 *　扩展功能模块 
 *  作者：秦元培
 *  时间：2015年10月15日
 **/


//初始化编辑器
var editor = editormd("editormd", {
    width: "100%",
    height: "720",
    path : 'lib/', //因为改变了项目结构，所以这里的路径发生了变化
    watch : true,
    tex : true,  //开启LTex支持
    flowChart : true, //开启流程图支持 
    sequenceDiagram : true,  //开启序列图支持
    previewCodeHighlight : true,
    todoList : true,

    //定义编辑器主题
    theme : "default",
    previewTheme : "default",
    editorTheme : "default",
    toolbarIcons : 
    [
      "bold", "italic", "quote", "ucwords", "uppercase", "lowercase", 
      "list-ul", "list-ol", "hr", 
      "link", "reference-link", "image", "code", "preformatted-text", "code-block",
      "table" , "datetime"
    ],
    onload : function()
    {
      initWindow(editor);
      initTrigger();
    }
  });

//引入NodeJS文件系统模块
var fs = require('fs');
//引入NodeWebkit相关模块
var gui = require('nw.gui');
//窗口API
var win = gui.Window.get();
//剪切版API
var clipboard = gui.Clipboard.get();

//是否进行了保存
var isSaved=false;

//当前编辑的文件
var editFile;

//上下问菜单
var contextMenu;

//读取文档
function readFile(filePath)
{
  //采用同步阻塞式方式来打开文件
	var data=fs.readFileSync(filePath,"utf-8");
  return data;
}

//保存文档
function writeFile(filePath,fileContent)
{
  //采用异步方式写入文件
	fs.writeFile(filePath,fileContent,function(error){
    	if(error){
	      	console.log("Write failed: " + error);
	      	return;
    	}
      console.log("Write Successful");
  });
}
        
/**
 * 初始化当前窗口
 * @param {Object} editormd对象             
 */
function initWindow(ed)
{
  //设置窗口位置在屏幕中央
  win.setPosition("center");
  //初始化当前菜单栏
  initMenuBar(ed);
  //初始化当前上下文菜单
  InitContextMenu(ed);
  //初始化快捷键
  initKeyBind()
  //ed.fullscreen();
}

/**
 * 初始化页面中的触发器             
 */
function initTrigger()
{
  //打开文件
  $("#fileOpen").change(function(evt) {
    onFileReadHandle($(this).val(),editor);
  });

  //保存Markdown
  $("#mdSave").change(function(evt) {
    editFile=$(this).val();
    isSaved=true;
    writeFile(editFile,editor.getMarkdown());
    win.title=editFile + "-" + "SmarkEditor";
    alert("在这里处理保存markdown的逻辑：" + savepath);
  });
}


/**
 * 初始化当前菜单栏
 * @param {Object} editormd对象             
 */
function initMenuBar(ed)
{
  //创建菜单栏
  var menu = new gui.Menu({ type: 'menubar' });

  //创建'文件'菜单
  var fileMenu = getFileMenu(ed);
  menu.append(new gui.MenuItem({ label: '文件(F)', submenu: fileMenu }));

  //创建'编辑'菜单
  var editMenu = getEditMenu(ed);
  menu.append(new gui.MenuItem({ label: '编辑(E)', submenu: editMenu }));

  //创建'视图'菜单
  var viewMenu = getViewMenu(ed);
  menu.append(new gui.MenuItem({ label: '视图(V)', submenu: viewMenu }));

  //创建'帮助'菜单
  var helpMenu = getHelpMenu(ed);
  menu.append(new gui.MenuItem({ label: '帮助(H)', submenu: helpMenu }));

  //设置菜单
  win.menu = menu;
}

/**
 * 初始化上下文菜单
 * @param {Object} editormd对象             
 */
function InitContextMenu(ed)
{
  contextMenu=new gui.Menu();

  contextMenu.append(new gui.MenuItem({ 
    label: '复制    Ctrl+C',
    click: function(){
      clipboard.set(ed.getSelection());
    } 
  }));

  contextMenu.append(new gui.MenuItem({ 
    label: '剪切    Ctrl+X',
    click: function(){
      clipboard.set(ed.getSelection());
      ed.replaceSelection('');
    }
  }));

  contextMenu.append(new gui.MenuItem({ 
    label: '黏贴    Ctrl+V',
    click: function(){
      ed.replaceSelection(clipboard.get());
    }
  }));

  document.getElementById("editormd").addEventListener('contextmenu',function(ev){
    ev.preventDefault();
    contextMenu.popup(ev.x, ev.y);
    return false;
  });
}

/*
 * 返回'文件'菜单
 * 参数：编辑器对象
 */
function getFileMenu(ed)
{
  //创建'文件'菜单
  var fileMenu = new gui.Menu();

  //'新建'菜单项
  fileMenu.append(new gui.MenuItem({
    label: '新建    Ctrl+N', 
    click: function() {
      onFileNewHandle(ed);
    }
  }));

  //'打开'菜单项
  fileMenu.append(new gui.MenuItem({ 
    label: '打开    Ctrl+O', 
    click: function() {
      $("#fileOpen").trigger("click");
    }
  }));

  //'保存'菜单项
  fileMenu.append(new gui.MenuItem({
    label: '保存    Ctrl+S',
    click: function(){
      saveMarkdown(editFile,ed);
    }
  }));

  //'另存为'菜单项
  fileMenu.append(new gui.MenuItem({
    label: '另存为    Ctrl+Shift+S',
    click: function(){
      $("#mdSave").trigger("click");
    }
  }));
  return fileMenu;
}

/*
 * 返回'编辑'菜单
 * 参数：编辑器对象
 */
function getEditMenu(ed)
{
  //创建'编辑'菜单
  var editMenu = new gui.Menu();

  //'撤销'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '撤销    Ctrl+Z',
    click: function(){
      ed.undo();
    } 
  }));

  editMenu.append(new gui.MenuItem({ 
    label: '重做    Ctrl+Y',
    click: function(){
      ed.redo();
    } 
  }));

  //'复制'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '复制    Ctrl+C',
    click: function(){
      clipboard.set(ed.getSelection());
    } 
  }));

  //'剪切'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '剪切    Ctrl+X',
    click: function(){
      clipboard.set(ed.getSelection());
      ed.replaceSelection('');
    }
  }));

  //'黏贴'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '黏贴    Ctrl+V',
    click: function(){
      ed.replaceSelection(clipboard.get());
    }
   }));

  //'查找'菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '查找    Ctrl+F',
    click: function(){
      ed.search();
    } 
  }));

  //替换菜单项
  editMenu.append(new gui.MenuItem({ 
    label: '替换    Ctrl+H',
    click: function(){
      ed.search("replace");
    }
  }));

  return editMenu;
}

/*
 * 返回'视图'菜单
 * 参数：编辑器对象
 */
function getViewMenu(ed)
{
  //创建'视图'菜单
  var viewMenu = new gui.Menu();

  viewMenu.append(new gui.MenuItem({ 
    label: '工具栏',
    type: 'checkbox',
    checked: "true",
    click: function(){
      if(this.checked==false){
        ed.hideToolbar(function(){
          console.log("hide the toolbar")
        });
      }else{
        ed.showToolbar(function(){
          console.log("show the toolbar")
        });
      }
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: '实时预览',
    type: 'checkbox',
    checked: 'true',
    click: function(){
      if(this.checked==false){
        ed.unwatch(function(){
          console.log("hide the preview")
        });
      }else{
        ed.watch(function(){
          console.log("show the preview")
        });
      }
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: '预览HTML',
    click: function(){
        ed.previewing();
    } 
  }));


  viewMenu.append(new gui.MenuItem({ 
    label: 'Default主题',
    click: function(){
        ed.setTheme('default')
        ed.setCodeMirrorTheme('default')
        ed.setPreviewTheme('default')
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: 'Dark主题',
    click: function(){
        ed.setTheme('dark')
        ed.setCodeMirrorTheme('pastel-on-dark')
        ed.setPreviewTheme('dark')
    } 
  }));

  viewMenu.append(new gui.MenuItem({ 
    label: 'Monokai主题',
    click: function(){
        ed.setTheme('dark')
        ed.setCodeMirrorTheme('monokai')
        ed.setPreviewTheme('dark')
    } 
  })); 
  //viewMenu.append(new gui.MenuItem({ 
    //label: '设置',
    //click: function(){
      
   // } 
  //}));

  return viewMenu;
}

/*
 * 返回'帮助'菜单
 * 参数：编辑器对象
 */
function getHelpMenu(ed)
{
  //创建'帮助菜单'
  var helpMenu = new gui.Menu();

  helpMenu.append(new gui.MenuItem({ 
    label: '使用帮助',
    click: function(){
      ed.executePlugin("helpDialog", "help-dialog/help-dialog");
    } 
  }));

  helpMenu.append(new gui.MenuItem({ 
    label: '关于SmarkEditor',
    click: function(){
      ed.createInfoDialog();
    } 
  }));

  return helpMenu;
}


/*
 * 读取文件操作
 * 参数：文件路径
 * 参数：编辑器对象
 */
function onFileReadHandle(filepath,ed)
{
  editFile=filepath;
  isSaved=true;
  var data=readFile(editFile);
  ed.setMarkdown(data);
  win.title=editFile + "-" + "SmarkEditor";
}

/*
 * 新建文件操作
 * 参数: 编辑器对象
 */
function onFileNewHandle(ed)
{
  ed.clear();
  isSaved=false;
  editFile="";
  win.title="新建Markdown文件.md-SmarkEditor";
}

/*
 * 保存markdown
 * 参数：文件路径
 * 参数: 编辑器对象
 */
function saveMarkdown(filepath,ed)
{
  if(isSaved==false){
      //设置对话框文件类型
      $("#mdSave").attr('accept','.md');
      //打开对话框
      $("#mdSave").trigger("click");
    }else{
      writeFile(filepath,ed.getValue());
      win.title=filepath + "-" + "SmarkEditor";
    }
}

/*
 *  初始化快捷键
 */
function initKeyBind()
{
    var keyMap = 
    {
        "Ctrl-N": function(cm) {
          onFileNewHandle(editor);
        },
        "Ctrl-O": function(cm) {
          $("#fileOpen").trigger("click");
        },
        "Ctrl-S": function(cm) {
          saveMarkdown(editFile,editor);
        },
        "Ctrl-Shift-S": function(cm) {
          $("#mdSave").trigger("click");
        },
        "Ctrl-Z": function(cm) { 
          cm.execCommand("selectAll");
        },
    };

    editor.addKeyMap(keyMap); 
}




　