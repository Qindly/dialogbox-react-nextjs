# Hook笔记
- useEffect
当什么什么改变时，才触发
- useState 
- useRef
类似let,const 什么的，就是一个单纯的定义，可以直接改变，然后减少其他组件的渲染
- useContext
用createContext来创建一个context，用
- useReducer
接受一个更复杂的hook，接受一个reducer函数和一个初始state作为参数
- memo
避免重复渲染，默认条件下，父组件渲染，也会导致子组件渲染，如果使用memo来包裹组件，则只有传递给组件的东西发生改变时，才会重新渲染组件
- useMemo
会从函数调用中创建/重新访问记忆化值，只有在第二个参数中传入的依赖项发生变化时，才会重新运行该函数。
- useRouter
api:是每一个后面的地址
- useCallback
和useMemo很像，那个是缓存内容，这是是缓存函数。

# CSS笔记
- position的使用
- 想要将画面左右不同步，要在外框使用
```
display: grid;
grid-template-columns: auto 1fr;
```
- 填充接下来的部分：```flex:1```
- 内部中间的空隙：```gap:3px```
- 使用其内部滑动：```overflow:auto```可分y还是x方向
- 上下层覆盖 ```z-index``` 越大越上面

# JS笔记



目前任务
1. 在footer发送消息时，能在页面接受到到消息，并且那个消息能返回回来（今）
2. 能够更新消息
明白全局变量，明白usereducer和如何更新