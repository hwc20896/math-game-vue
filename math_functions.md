## 本專案中變換的公式

> 此處將使用向量（矩陣）運算和複數運算（有時候）。  
> 雖然如此，兩個方法的推導策略基本一致。

### 起始點：$\begin{pmatrix}x\\y\end{pmatrix}$ 或 $x+yi$

### 平移

#### 向量運算：$\begin{pmatrix}\Delta x\\\Delta y\end{pmatrix}$

$$
\begin{pmatrix}x\\y\end{pmatrix} \longleftarrow \begin{pmatrix}x\\y\end{pmatrix}+\begin{pmatrix}\Delta x\\\Delta y\end{pmatrix}=\begin{pmatrix}x+\Delta x\\y+\Delta y\end{pmatrix}
$$

#### 複數運算：$\Delta x+i\Delta y$

$$
x + yi\longleftarrow (x+yi) + (\Delta x+i\Delta y) = (x+\Delta x)+(y+\Delta y)i
$$

### 縮放：$(\lambda)$

#### 向量運算：

$$
\begin{pmatrix}x\\y\end{pmatrix} \longleftarrow \lambda\begin{pmatrix}x\\y\end{pmatrix} = \begin{pmatrix}\lambda x\\\lambda y\end{pmatrix}
$$

#### 複數運算：

$$
x+yi \longleftarrow \lambda(x+yi) = (\lambda x)+(\lambda y)i
$$

### 繞原點旋轉：$(\theta)\longrightarrow$ 通式：_繞任意點旋轉_

#### 向量運算

$$
\begin{pmatrix}x\\y\end{pmatrix}
=\begin{pmatrix}r\cos\varphi\\r\sin\varphi\end{pmatrix}
\longleftarrow\begin{pmatrix}r\cos(\varphi+\theta)\\r\sin(\varphi+\theta)\end{pmatrix}
=\begin{pmatrix}r\cos\varphi\cos\theta-r\sin\varphi\sin\theta\\r\sin\varphi\cos\theta+r\cos\varphi\sin\theta\end{pmatrix}
=\begin{pmatrix}x\cos\theta-y\sin\theta\\y\cos\theta+x\sin\theta\end{pmatrix}
=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}
$$

#### 複數運算

$$
\begin{align}
x+yi=re^{i\varphi}
\longleftarrow re^{i(\varphi+\theta)}&=r(\cos(\varphi+\theta)+i\sin(\varphi+\theta))\\
&=(r\cos\varphi\cos\theta-r\sin\varphi\sin\theta)+(r\sin\varphi\cos\theta+r\cos\varphi\sin\theta)i\\
&=(x\cos\theta-y\sin\theta)+(y\cos\theta+x\sin\theta)i
\end{align}
$$

### $x$ 軸反射： （$\longrightarrow$ 通式：_以任意直綫反射_）

$$
\begin{pmatrix}x\\y\end{pmatrix}\longleftarrow\begin{pmatrix}x\\-y\end{pmatrix}
=\begin{pmatrix}1&0\\0&-1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}
$$

### $y$ 軸反射： （$\longrightarrow$ 通式：_以任意直綫反射_）

$$
\begin{pmatrix}x\\y\end{pmatrix}\longleftarrow\begin{pmatrix}-x\\y\end{pmatrix}
=\begin{pmatrix}-1&0\\0&1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}
$$

### 繞任意點旋轉： ( $P=\begin{pmatrix}a\\b\end{pmatrix},\theta$ )

#### 向量運算

$$
\begin{align}
\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}x-a+a\\y-b+b\end{pmatrix}=\begin{pmatrix}x-a\\y-b\end{pmatrix}+\begin{pmatrix}a\\b\end{pmatrix}
&\longleftarrow\begin{pmatrix}(x-a)\cos\theta-(y-b)\sin\theta\\(y-b)\cos\theta+(x-a)\sin\theta\end{pmatrix}+\begin{pmatrix}a\\b\end{pmatrix}\\
&=\begin{pmatrix}(x-a)\cos\theta-(y-b)\sin\theta+a\\(y-b)\cos\theta+(x-a)\sin\theta+b\end{pmatrix}\\
&=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}\begin{pmatrix}x-a\\y-b\end{pmatrix}+\begin{pmatrix}a\\b\end{pmatrix}
\end{align}
$$

#### 複數運算

// TODO

### 以 $y=x$ 反射：（$\longrightarrow$ 通式：_以任意直綫反射_）

$$
\begin{pmatrix}x\\y\end{pmatrix}\longleftarrow\begin{pmatrix}y\\x\end{pmatrix}
=\begin{pmatrix}0&1\\1&0\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}
$$

### 以 $y=-x$ 反射：（$\longrightarrow$ 通式：_以任意直綫反射_）

$$
\begin{pmatrix}x\\y\end{pmatrix}\longleftarrow\begin{pmatrix}-y\\-x\end{pmatrix}
=\begin{pmatrix}0&-1\\-1&0\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}
$$

### 以任意直綫反射

//  TODO