#!/bin/bash

echo "🚀 正在调用本地 Ollama (bge-m3) 进行 1024 维降维打击，请稍候..."

# 1. 提取四篇文章的 1024 维特征向量
V1=$(ollama run bge-m3 "A320 的起飞")
V2=$(ollama run bge-m3 "737 的降落")
V3=$(ollama run bge-m3 "飞机的起降原理")
V4=$(ollama run bge-m3 "炒方便面的做法")

# 2. 将高维张量交给 Python 进行矩阵计算，并输出 Markdown 表格
python3 -c '
import sys, json, math

# 计算余弦相似度与欧氏距离
def calculate_metrics(v1, v2):
    dot_product = sum(a*b for a, b in zip(v1, v2))
    magnitude1 = math.sqrt(sum(a*a for a in v1))
    magnitude2 = math.sqrt(sum(b*b for b in v2))
    
    # 防止分母为0
    if magnitude1 * magnitude2 == 0:
        return 0, 0
        
    cos_sim = dot_product / (magnitude1 * magnitude2)
    euclidean = math.sqrt(sum((a-b)**2 for a,b in zip(v1, v2)))
    return cos_sim, euclidean

try:
    # 解析传入的 JSON 数组
    vecs = [json.loads(sys.argv[i]) for i in range(1, 5)]
    texts = [
        "第一篇 (A320 的起飞)", 
        "第二篇 (737 的降落)", 
        "第三篇 (飞机的起降原理)", 
        "第四篇 (炒方便面的做法)"
    ]

    print("\n### BGE-M3 1024维空间距离计算结果\n")
    print("| 文档 A | 文档 B | 余弦相似度 (Cosine) | 欧氏距离 (L2) | 机器得出的结论 |")
    print("| :--- | :--- | :---: | :---: | :--- |")

    # 两两对比计算距离
    for i in range(len(texts)):
        for j in range(i+1, len(texts)):
            sim, dist = calculate_metrics(vecs[i], vecs[j])
            
            print(f"| {texts[i]} | {texts[j]} | **{sim:.4f}** | {dist:.4f} |")

except Exception as e:
    print("解析失败，请检查模型输出是否为纯 JSON 数组格式。详细错误:", e)
' "$V1" "$V2" "$V3" "$V4"

echo -e "\n✅ 计算完成。"