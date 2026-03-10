import sys

with open('slides.md', 'r', encoding='utf-8') as f:
    text = f.read()

# 4.3 Replace
text = text.replace(
'''## 4.3 换个角度看世界：点乘与余弦

:::::::::::::: {.columns}
::: {.column width="50%"}
**向量点乘 (内积)**''',
'''## 4.3 换个角度看世界：点乘与余弦

:::::::::::::: {.columns}
::: {.column width="50%"}
::: {.fragment}
**向量点乘 (内积)**'''
)

text = text.replace(
'''<span style="color: red;">毫不相干！</span>
:::

::: {.column width="50%"}
**余弦相似度 (Cosine Similarity)**''',
'''<span style="color: red;">毫不相干！</span>
:::
:::

::: {.column width="50%"}
::: {.fragment}
**余弦相似度 (Cosine Similarity)**'''
)

text = text.replace(
'''* $\\theta = 90^\circ \Rightarrow \cos(90^\circ) = 0$ (风马牛不相及)
:::
::::::::::::::''',
'''* $\\theta = 90^\circ \Rightarrow \cos(90^\circ) = 0$ (风马牛不相及)
:::
:::
::::::::::::::'''
)

# 4.4 Replace
text = text.replace(
'''## 4.4 终极技术：L2 归一化

::: {style="font-size: 1.2em; text-align: center;"}
**强行把所有向量的长度变成 1（投射到“单位超球面”上）**
:::''',
'''## 4.4 终极技术：L2 归一化

::: {style="font-size: 1.2em; text-align: center;"}
**强行把所有向量的长度变成 1（投射到“单位超球面”上）**
:::'''
)

text = text.replace(
''':::::::::::::: {.columns}
::: {.column width="50%"}
**第一，关于点乘**''',
''':::::::::::::: {.columns}
::: {.column width="50%"}
::: {.fragment}
**第一，关于点乘**'''
)

text = text.replace(
'''<span style="color: blue;">单位超球面上：点乘直接等于余弦！</span>
:::

::: {.column width="50%"}
**第二，关于欧氏距离**''',
'''<span style="color: blue;">单位超球面上：点乘直接等于余弦！</span>
:::
:::

::: {.column width="50%"}
::: {.fragment}
**第二，关于欧氏距离**'''
)

text = text.replace(
'''$$ d = \sqrt{2 - 2\cos(\theta)} $$
:::
::::::::::::::''',
'''$$ d = \sqrt{2 - 2\cos(\theta)} $$
:::
:::
::::::::::::::'''
)

text = text.replace(
'''::: {style="margin-top: 1.5em; text-align: center; color: green;"}
**殊途同归：直线距离和旋转角度被完美地绑定在了一起**
:::''',
'''::: {.fragment}
::: {style="margin-top: 1.5em; text-align: center; color: green;"}
**殊途同归：直线距离和旋转角度被完美地绑定在了一起**
:::
:::'''
)

# 4.5 1024 维度的精细画像
text = text.replace(
'''每一次查询，系统不再是简单的关键字匹配，而是在这 1024 维的宇宙中，寻找距离最近的一组坐标。

<br>

### Demo 3：演示 AI 把文本变成向量 (bge-m3)''',
'''每一次查询，系统不再是简单的关键字匹配，而是在这 1024 维的宇宙中，寻找距离最近的一组坐标。

<br>

::: {.fragment}
### Demo 3：演示 AI 把文本变成向量 (bge-m3)'''
)

text = text.replace(
'''| 第1篇 A320起飞 | 第4篇 炒方便面 | **0.3252** | 1.1618 | 风马牛不相及 |''',
'''| 第1篇 A320起飞 | 第4篇 炒方便面 | **0.3252** | 1.1618 | 风马牛不相及 | 
:::'''
)

# 4.6 万物皆可向量化
text = text.replace(
'''- **图片**：提取矩阵特征值或感知哈希
- **飞机实时飞行数据(QAR)**：
  - 空速, 地速, 高度, 俯仰角，N1...
  - 500多个核心传感器数据
  - = 这一秒由于在 500维空间里的**一个点** 

<span style="color: blue;">飞机每秒的运动，就是 500 维宇宙里的连续轨迹！</span>''',
'''::: {.incremental}
- **图片**：提取矩阵特征值或感知哈希
- **飞机实时飞行数据(QAR)**：
  - 空速, 地速, 高度, 俯仰角，N1...
  - 500多个核心传感器数据
  - = 这一秒由于在 500维空间里的**一个点** 
:::
::: {.fragment}
<span style="color: blue;">飞机每秒的运动，就是 500 维宇宙里的连续轨迹！</span>
:::'''
)


# Security corridor
text = text.replace(
'''不再需要几百条死板的 `IF-ELSE` 判断：

- 几十万个安全着陆航班的向量 $\rightarrow$ <span style="color: green;">粗壮的“安全走廊”聚类</span>
- 发生异常偏离的坐标 $\rightarrow$ <span style="color: red;">欧氏距离急剧变大触发报警</span>

<br>

> "不管处理旅客投诉、蒙皮划痕照片、还是万米高空的 A320，在底层算法看来，全都是一模一样的空间几何距离计算！"

**我们用一套数学逻辑，统一了整个世界。**''',
'''不再需要几百条死板的 `IF-ELSE` 判断：

::: {.incremental}
- 几十万个安全着陆航班的向量 $\rightarrow$ <span style="color: green;">粗壮的“安全走廊”聚类</span>
- 发生异常偏离的坐标 $\rightarrow$ <span style="color: red;">欧氏距离急剧变大触发报警</span>
:::

<br>

::: {.fragment}
> "不管处理旅客投诉、蒙皮划痕照片、还是万米高空的 A320，在底层算法看来，全都是一模一样的空间几何距离计算！"

**我们用一套数学逻辑，统一了整个世界。**
:::'''
)

with open('slides.md', 'w', encoding='utf-8') as f:
    f.write(text)
