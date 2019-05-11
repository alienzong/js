//移动端轮播
//1.自动轮播+ 2.touch事件滑动
//1.css3技术 位移 + 过渡 + 结束过渡事件(循环)
var banner = document.querySelector('.jd_banner');
var imageBox = banner.children[0];
var pointBox = banner.children[1];
var points = pointBox.querySelectorAll('li');
//console.log(points);
//获取banner的可见宽度
var w = banner.clientWidth;
//console.log(w);
//位移方法
var addTranslate = function(elem,x){
  elem.style.transform='translateX('+x+'px)';
  elem.style.webkitTransform = 'translateX('+x+'px)';
};
//过渡方法
var addTransition = function(elem){
  elem.style.transition = 'all 0.3s ease-out';
  elem.style.webkitTransition = 'all 0.3s ease-out';
};
//清除过渡方法
var clearTransition = function(elem){
  elem.style.transition = 'none';
  elem.style.webkitTransition = 'none';
};
/*实现自动轮播 定时器 setInterval*/
var index = 1;
var timer = null;

function setTimer(){
   timer = setInterval(function(){
     index++;
     //调用位移和过渡方法
     addTranslate(imageBox,-w*index);
     addTransition(imageBox);
     console.log(index);
   },2000);
};
setTimer();
/*监听页面可见性改变事件 */
document.addEventListener('visibilitychange',function(){
  if(document.hidden){
    clearInterval(timer);
    timer = null;
  }else{
    setTimer();
  }
});
/*绑定过渡结束事件,来做轮播无缝衔接 transitionEnd*/
imageBox.addEventListener('webkitTransitionEnd',function(){
  console.log(index);
  if(index>=9){
    index = 1;
  }else if(index<1){
    index = 8;
  };//清除过渡
  clearTransition(imageBox);
  //定位回到第一张图
  addTranslate(imageBox,-w*index);
  //调用setPoint
  setPoint();
});
//点 随着轮播图同时滚动,改变 点 的样式
function setPoint(){
  for(var i = 0;i<points.length;i++){
    points[i].className = '';
  }
  index == 9?points[0].className='now':points[index-1].className='now'
};
//添加touch滑动事件
var startx = 0,
    movex = 0,
    distancex = 0,
    isMove = false;
    //touchstart 事件
    imageBox.addEventListener('touchstart',function(e){
      //取消之前的事件
      e.preventDefault();
      //记录startx
      startx = e.touches[0].pageX;
      //touch 时,权值高.暂停自动轮播
      clearInterval(timer);
      timer=null;
      console.log('touchstart',startx);
    });
    //touchmove 事件
    imageBox.addEventListener('touchmove',function(e){
      //取消之前的事件
      e.preventDefault();
      isMove = true;
      //记录movex
      movex = e.touches[0].pageX;
      //记录滑动距离
      distancex = movex - startx;
      //清除过渡
      clearTransition(imageBox);
      //让图片跟着手滑动
      addTranslate(imageBox,-w*index + distancex);
    });
    //touchend 事件
    imageBox.addEventListener('touchend',function(e){
       //清除之前的事件
       e.preventDefault();
       if(!isMove){
        return;
       }
       if(Math.abs(distancex)>w/3){//滑动有效
        if(distancex>0){//向右上一张
          index--;
        }else if(distancex<0){//向左滑,下一张
          index++;
        }
       }
       //定位 过渡
    addTransition(imageBox);
    addTranslate(imageBox,-w*index);
    //初始化变量,防止对下一次的滑动有影响
    startx = 0,movex = 0,distancex = 0,isMove = false ;
    //再次启动定时器
    setTimer();
    });
    



