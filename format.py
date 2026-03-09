import re

with open('Notes.md', 'r', encoding='utf-8') as f:
    text = f.read()

# 删除和替换套话
text = text.replace('见证奇迹的时刻到了', '接下来我们看看实际效果')
text = text.replace('奇迹发生了', '发生了显著的变化')
text = text.replace('绝妙的数学魔法', '巧妙的数学运算')
text = text.replace('数学魔法', '数学运算')
text = text.replace('魔法', '技术')
text = text.replace('灵魂契合', '高度相关')
text = text.replace('仿佛拥有灵魂的', '高度拟人的')
text = text.replace('灵魂概念', '核心概念')
text = text.replace('极其毛骨悚然', '令人惊讶')
text = text.replace('毛骨悚然', '惊讶')
text = text.replace('你会不会疯掉', '系统将变得不可用')
text = text.replace('没有任何羁绊', '没有任何历史交互数据')
text = text.replace('羁绊', '关联')
text = text.replace('最可怕的是', '值得注意的是')
text = text.replace('恐怖的黑盒', '复杂的系统')
text = text.replace('极端恐怖的', '巨大的')
text = text.replace('非常神秘的东西', '神秘的概念')

# 处理“极其XXX”
text = re.sub(r'极其(简单|复杂|昂贵|庞大|精密|死板|缓慢|精细|精准|严密|严格|巧妙|脆弱|深奥|优美|冷酷|狭窄|重要|致密|暴力|危险|冰冷)', r'\1', text)
text = re.sub(r'极其(重要|强大|关键)', r'非常\1', text)
text = re.sub(r'极其', '十分', text)

# 处理“非常XXX”
text = re.sub(r'非常(简单|复杂|古老|直观|完美|肤浅|现实)', r'\1', text)
text = re.sub(r'非常', '很', text)

# 删除多余的会话语
text = re.sub(r'各位高管，?', '', text)
text = re.sub(r'大家想一想，?', '', text)
text = re.sub(r'顺水推舟地想一想，?', '进一步推导，', text)
text = re.sub(r'大家想象一下，?', '假设', text)
text = re.sub(r'大家注意观察，?', '请注意', text)
text = re.sub(r'大家注意，?', '请注意', text)
text = re.sub(r'大家注意', '请注意', text)
text = re.sub(r'大家发现问题了吗', '这里存在一个问题', text)

# 其他浮夸词
text = text.replace('简直就是我们的终极梦想', '正符合我们的业务需求')
text = text.replace('彻底宕机', '难以处理')
text = text.replace('彻底瘫痪', '瘫痪')
text = text.replace('彻底颠覆', '颠覆')
text = text.replace('彻底踏平了', '大幅降低了')
text = text.replace('极其残暴地压缩', '大幅压缩')
text = text.replace('残暴地', '')
text = text.replace('疯狂跳跃', '推演')
text = text.replace('疯狂自动生成', '快速自动生成')
text = text.replace('极度疯狂的', '不知疲倦的')
text = text.replace('疯狂内卷', '激烈竞争')
text = text.replace('疯狂涌入', '大量涌入')
text = text.replace('死死地长在', '深度绑定在')
text = re.sub(r'毫无退路。?', '', text)

with open('Notes.md', 'w', encoding='utf-8') as f:
    f.write(text)

