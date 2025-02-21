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



需要修改的地方：
ChatList 里面有个获取chat的route;
ChatItem 里面有个更改chat标题和删除chat
MainPage 里要渲染获取messageList
以及chatFunction里面的大部分代码


Chat messages: [
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "{\"name\":\"Deepseek-deepseek_chat\",\"arguments\":{\"Authorization\":\"sk-6ARuy9FxxOQUYVUXF5387968D8774cE283156e5e01937487\",\"model\":\"deepseek-reasoner\",\"messages\":[{\"content\":\"请介绍一下自己\",\"role\":\"user\"}],\"max_tokens\":200,\"base_url\":\"https://api.ai666.net\"},\"plugin_id\":7460849065589227535,\"plugin_name\":\"Deepseek\",\"api_id\":7460849065589260303,\"api_name\":\"deepseek_chat\",\"plugin_type\":1}",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865568,
    "id": "7472665703578107943",
    "role": "assistant",
    "type": "function_call",
    "updated_at": 1739865568
  },
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "{\"model\":\"deepseek-r1\",\"object\":\"chat.completion\",\"created\":1739865597,\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":\"<think>\\n好的，用户让我介绍一下自己。首先，我需要明确用户的需求是什么。他可能是在测试我，或者想了解我的功能。这时候我应该按照标准的回应来介绍自己，说明我是由深度求索开发的智能助手，专注于用技术解决问题，提供准确信息。但可能用户需要更详细的回答，所以我需要确认是否要扩展内容。如果用户没有特别说明，保持简洁明了即可。还要注意避免使用任何被禁止的格式，比如markdown，保持口语化。同时，确保回应友好且专业，符合公司的指导方针。现在，组织语言，确保覆盖主要点：开发者、技术基础、功能范围、持续学习、使命，最后邀请用户提问。检查是否符合所有要求，然后回复。\\n</think>\\n\\n您好！我是DeepSeek-R1，一个由深度求索（DeepSeek）公司开发的智能助手，致力于通过先进的技术提供准确的信息查询和问题解答服务。我擅长处理多领域的复杂问题，并通过持续\"},\"finish_reason\":\"length\",\"index\":0}],\"system_fingerprint\":\"\",\"id\":\"8e8da98a1e0b4ea69382a7ace571a5ca\",\"usage\":{\"completion_tokens_details\":null,\"prompt_tokens\":6,\"completion_tokens\":200,\"total_tokens\":206,\"prompt_tokens_details\":null}}",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865597,
    "id": "7472665828388012068",
    "role": "assistant",
    "type": "tool_response",
    "updated_at": 1739865597
  },
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "我是一个致力于像GPT一样为你服务的智能体呀。能够理解和分析你输入的各类问题，凭借我所掌握的广泛知识储备，为你提供合理、全面且有深度的回答。 \n\n比如你在学习、生活、工作中遇到问题，像科学知识、历史文化、技术难题、写作创意等方面的疑惑，都可以向我提问，我会尽力给你提供满意的答案。 \n\n如果你有任何问题，欢迎随时告诉我，让我们一起交流探讨~刚才调用了Deepseek的模型来辅助回复，希望能让你更清楚了解我。  ",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865568,
    "id": "7472665703578058791",
    "role": "assistant",
    "type": "answer",
    "updated_at": 1739865603
  },
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "{\"msg_type\":\"generate_answer_finish\",\"data\":\"{\\\"finish_reason\\\":0,\\\"FinData\\\":\\\"\\\"}\",\"from_module\":null,\"from_unit\":null}",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865605,
    "id": "7472665867285823551",
    "role": "assistant",
    "type": "verbose",
    "updated_at": 1739865605
  },
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "你可以回答哪些领域的问题？",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865605,
    "id": "7472665867285839935",
    "role": "assistant",
    "type": "follow_up",
    "updated_at": 1739865605
  },
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "你是如何学习和更新知识的？",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865605,
    "id": "7472665867285856319",
    "role": "assistant",
    "type": "follow_up",
    "updated_at": 1739865605
  },
  {
    "bot_id": "7470927163329069110",
    "chat_id": "7472665686892888076",
    "content": "你能帮我写一篇文章吗？",
    "content_type": "text",
    "conversation_id": "7472662926357217319",
    "created_at": 1739865605,
    "id": "7472665867285872703",
    "role": "assistant",
    "type": "follow_up",
    "updated_at": 1739865605
  }
]