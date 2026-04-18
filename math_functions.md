## 本專案中變換的公式

> 此處將使用向量（矩陣）運算和複數運算（有時候）。  
> 雖然如此，兩個方法的推導策略基本一致。

### 起始點：  $\left(x,y\right)$ 或 $x+yi$

### 平移

#### 向量運算： $\left(\Delta x,\Delta y\right)$

$$
\begin{pmatrix}x\\\ y\end{pmatrix} \longleftarrow \begin{pmatrix}x\\\ y\end{pmatrix}+\begin{pmatrix}\Delta x\\\ \Delta y\end{pmatrix}=\begin{pmatrix}x+\Delta x\\\ y+\Delta y\end{pmatrix}
$$

#### 複數運算： $\Delta x+\Delta y\cdot i$

$$
x + yi\longleftarrow (x+yi) + (\Delta x+\Delta y\cdot i) = (x+ \Delta x)+(y+ \Delta y)i
$$

### 縮放： $\left(\lambda\right)$

#### 向量運算：

$$
\begin{pmatrix}x\\\ y\end{pmatrix} \longleftarrow \lambda\begin{pmatrix}x\\\ y\end{pmatrix} = \begin{pmatrix}\lambda x\\\ \lambda y\end{pmatrix}
$$

#### 複數運算：

$$
x+yi \longleftarrow \lambda(x+yi) = (\lambda x)+(\lambda y)i
$$

### 繞原點旋轉： $\left( \theta \right)\longrightarrow$ 通式：_繞任意點旋轉_

#### 向量運算

$$
\begin{pmatrix}x\\\ y\end{pmatrix}
=\begin{pmatrix}r\cos\varphi\\\ r\sin\varphi\end{pmatrix}
\longleftarrow\begin{pmatrix}r\cos(\varphi+\theta)\\\ r\sin(\varphi+\theta)\end{pmatrix}
=\begin{pmatrix}r\cos\varphi\cos\theta-r\sin\varphi\sin\theta\\\ r\sin\varphi\cos\theta+r\cos\varphi\sin\theta\end{pmatrix}
=\begin{pmatrix}x\cos\theta-y\sin\theta\\\ y\cos\theta+x\sin\theta\end{pmatrix}
=\begin{pmatrix}\cos\theta&-\sin\theta\\\ \sin\theta&\cos\theta\end{pmatrix}\begin{pmatrix}x\\\ y\end{pmatrix}
$$

> 其中臨時變量 $r$ 為向量模 $\sqrt{x^2+y^2}$ ， $\varphi$ 為向量角度 $\arctan\left(\frac{y}{x}\right)$。

### 複數運算

$$
\begin{align}
x+yi=re^{i\varphi}
\longleftarrow re^{i(\varphi+\theta)}&=r(\cos(\varphi+\theta)+i\sin(\varphi+\theta))\\
&=(r\cos\varphi\cos\theta-r\sin\varphi\sin\theta)+(r\sin\varphi\cos\theta+r\cos\varphi\sin\theta)i\\
&=(x\cos\theta-y\sin\theta)+(y\cos\theta+x\sin\theta)i
\end{align}
$$

> 其中臨時變量 $r$ 為模 $\sqrt{x^2+y^2}$ ， $\varphi$ 為輻角 $\arctan\left(\frac{y}{x}\right)$。

### $x$ 軸反射： （ $\longrightarrow$ 通式：_以任意直線反射_）

$$
\begin{pmatrix}x\\\ y\end{pmatrix}\longleftarrow\begin{pmatrix}x\\\ -y\end{pmatrix}
=\begin{pmatrix}1&0\\\ 0&-1\end{pmatrix}\begin{pmatrix}x\\\ y\end{pmatrix}
$$

### $y$ 軸反射： （ $\longrightarrow$ 通式：_以任意直線反射_）

$$
\begin{pmatrix}x\\\ y\end{pmatrix}\longleftarrow\begin{pmatrix}-x\\\ y\end{pmatrix}
=\begin{pmatrix}-1&0\\\ 0&1\end{pmatrix}\begin{pmatrix}x\\\ y\end{pmatrix}
$$

### 繞任意點旋轉： ( $P=\left(a,b\right), \theta$ )

#### 向量運算

$$
\begin{align}
\begin{pmatrix}x\\\ y\end{pmatrix}=\begin{pmatrix}x-a+a\\\ y-b+b\end{pmatrix}
=\begin{pmatrix}x-a\\\ y-b\end{pmatrix}+\begin{pmatrix}a\\\ b\end{pmatrix}
=\begin{pmatrix}r\cos\varphi \\\ r\sin\varphi\end{pmatrix}+\begin{pmatrix}a\\\ b\end{pmatrix}
&\longleftarrow \begin{pmatrix}r\cos\left(\varphi+\theta\right) \\\ r\sin\left(\varphi+\theta\right)\end{pmatrix}+\begin{pmatrix}a\\\ b\end{pmatrix}\\
&=\begin{pmatrix}r\cos\varphi\cos\theta-r\sin\varphi\sin\theta \\\ r\sin\varphi\cos\theta+r\cos\varphi\sin\theta\end{pmatrix}+\begin{pmatrix}a\\\ b\end{pmatrix}\\
&=\begin{pmatrix}(x-a)\cos\theta-(y-b)\sin\theta\\\ (y-b)\cos\theta+(x-a)\sin\theta\end{pmatrix}+\begin{pmatrix}a\\\ b\end{pmatrix}\\
&=\begin{pmatrix}(x-a)\cos\theta-(y-b)\sin\theta+a\\\ (y-b)\cos\theta+(x-a)\sin\theta+b\end{pmatrix}\\
&=\begin{pmatrix}\cos\theta&-\sin\theta\\\ \sin\theta&\cos\theta\end{pmatrix}\begin{pmatrix}x-a\\\ y-b\end{pmatrix}+\begin{pmatrix}a\\\ b\end{pmatrix}
\end{align}
$$

> 其中臨時變量 $r$ 為模 $\sqrt{\left(x-a\right)^2+\left(y-b\right)^2}$ ， $\varphi$ 為向量角度 $\arctan\left(\frac{y-b}{x-a}\right)$。

> __補充：複數運算__
>
> $$
\begin{align}
&設起始點對應複數 z=x+yi，繞點所對應複數 c=a+bi，則繞點旋轉後對應複數w為\\
&w=(z-c)e^{i\theta}+c。
\end{align}
$$

### 以 $y=x$ 反射：（$\longrightarrow$ 通式：_以任意直線反射_）

$$
\begin{pmatrix}x\\\ y\end{pmatrix}\longleftarrow\begin{pmatrix}y\\\ x\end{pmatrix}
=\begin{pmatrix}0&1\\\ 1&0\end{pmatrix}\begin{pmatrix}x\\\ y\end{pmatrix}
$$

### 以 $y=-x$ 反射：（$\longrightarrow$ 通式：_以任意直線反射_）

$$
\begin{pmatrix}x\\\ y\end{pmatrix}\longleftarrow\begin{pmatrix}-y\\\ -x\end{pmatrix}
=\begin{pmatrix}0&-1\\\ -1&0\end{pmatrix}\begin{pmatrix}x\\\ y\end{pmatrix}
$$

### 以任意直線反射

$$
\begin{align}
\begin{pmatrix}x\\\ y\end{pmatrix}
\longleftarrow\begin{pmatrix}x-2A\cdot\frac{Ax+By+C}{A^2+B^2}\\\ y-2B\cdot\frac{Ax+By+C}{A^2+B^2}\end{pmatrix}
=\begin{pmatrix}x\\\ y\end{pmatrix}-2\cdot\frac{Ax+By+C}{A^2+B^2}\begin{pmatrix}A\\\ B\end{pmatrix}
\end{align}
$$

#### 推導：

$$
\begin{align}
&設有點 P=\left(x,y\right) 及其對稱點 P'\left(x',y'\right) ，則其斜率 k_0 即為\frac{y-y'}{x-x'}。\\
&直線\ell: Ax+By+C=0 斜率 k=-\frac{A}{B}。\\
&因 PP' 必與 \ell 垂直，故 k_0=-\frac{1}{k}=\frac{B}{A}。\\
&即 \exists k>0,\begin{pmatrix}x'\\\ y'\end{pmatrix}=\begin{pmatrix}x-kA\\\ y-kB\end{pmatrix}\\
\\
&設中點 M=\left(\frac{x+x'}{2},\frac{y+y'}{2}\right)=\left(x-\frac{kA}{2},y-\frac{kB}{2}\right)。\\
&因中點必在\ell上，故A\left(x-\frac{kA}{2}\right)+B\left(y-\frac{kB}{2}\right)+C=0必成立。\\
&Ax-A\cdot\frac{kA}{2}+By-B\cdot\frac{kB}{2}+C=0\\
&-\frac{k}{2}\left(A^2+B^2\right)=-\left(Ax+By+C\right)\\
&k=2\cdot\frac{Ax+By+C}{A^2+B^2}\\
\\
&代回得\begin{pmatrix}x'\\\ y'\end{pmatrix}
=\begin{pmatrix}x-2A\cdot\frac{Ax+By+C}{A^2+B^2}\\\ y-2B\cdot\frac{Ax+By+C}{A^2+B^2}\end{pmatrix}\\
&完畢。
\end{align}
$$

> 補充：若 $A$ 和 $B$ 同時為 $0$ ，直線無效，故對任意有效直線，必須有 $A^2+B^2\neq0$ 。
>
> 補充2：矩陣形式（不是我在說，這個確實有點地獄）
>
> $$
\begin{pmatrix}x\\\ y\\\ 1\end{pmatrix}\longleftarrow\frac{1}{A^2+B^2}\begin{pmatrix}B^2-A^2&-2AB&-2AC\\\ -2AB&A^2-B^2&-2BC\\\ 0&0&A^2+B^2\end{pmatrix}\begin{pmatrix}x\\\ y\\\ 1\end{pmatrix}
$$