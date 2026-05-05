// ==================== 导航切换 ====================
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // 显示对应的公式面板
        const formulaId = this.dataset.formula;
        document.querySelectorAll('.formula-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(formulaId).classList.add('active');
    });
});

// ==================== 工具函数 ====================

/**
 * 显示结果
 */
function showResult(elementId, success, title, value, detail) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.className = 'result show ' + (success ? 'success' : 'error');
    resultDiv.innerHTML = `
        <div class="result-title">${title}</div>
        <div class="result-value">${value}</div>
        ${detail ? `<div class="result-detail">${detail}</div>` : ''}
    `;
}

/**
 * 计算阶乘
 */
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * 计算组合数 C(n, k)
 */
function combination(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    // 使用优化算法避免大数溢出
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result = result * (n - k + i) / i;
    }
    return result;
}

/**
 * 验证概率值是否在 [0, 1] 范围内
 */
function validateProbability(value, name) {
    if (value < 0 || value > 1) {
        throw new Error(`${name} 必须在 0 到 1 之间`);
    }
}

/**
 * 验证正整数
 */
function validatePositiveInt(value, name) {
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${name} 必须是正整数`);
    }
}

/**
 * 验证非负整数
 */
function validateNonNegativeInt(value, name) {
    if (!Number.isInteger(value) || value < 0) {
        throw new Error(`${name} 必须是非负整数`);
    }
}

// ==================== 古典概型 ====================
function calculateClassical() {
    try {
        const m = parseInt(document.getElementById('classical-m').value);
        const n = parseInt(document.getElementById('classical-n').value);

        validateNonNegativeInt(m, '事件A包含的基本事件数 m');
        validatePositiveInt(n, '总基本事件数 n');

        if (m > n) {
            throw new Error('事件A包含的基本事件数 m 不能大于总基本事件数 n');
        }

        const probability = m / n;
        const percentage = (probability * 100).toFixed(2);

        showResult('classical-result', true, '计算结果',
            `P(A) = ${probability.toFixed(4)} = ${percentage}%`,
            `计算过程：P(A) = ${m} / ${n} = ${probability.toFixed(4)}<br>
            即事件A发生的概率为 <span class="highlight">${percentage}%</span>`
        );
    } catch (error) {
        showResult('classical-result', false, '输入错误', error.message, '');
    }
}

// ==================== 条件概率 ====================
function calculateConditional() {
    try {
        const pab = parseFloat(document.getElementById('cond-pab').value);
        const pb = parseFloat(document.getElementById('cond-pb').value);

        validateProbability(pab, 'P(A∩B)');
        validateProbability(pb, 'P(B)');

        if (pb === 0) {
            throw new Error('P(B) 不能为 0');
        }

        const result = pab / pb;
        const percentage = (result * 100).toFixed(2);

        showResult('conditional-result', true, '计算结果',
            `P(A|B) = ${result.toFixed(4)} = ${percentage}%`,
            `计算过程：P(A|B) = ${pab} / ${pb} = ${result.toFixed(4)}<br>
            即在事件B发生的条件下，事件A发生的概率为 <span class="highlight">${percentage}%</span>`
        );
    } catch (error) {
        showResult('conditional-result', false, '输入错误', error.message, '');
    }
}

// ==================== 贝叶斯公式 ====================
function calculateBayes() {
    try {
        const pa = parseFloat(document.getElementById('bayes-pa').value);
        const pba = parseFloat(document.getElementById('bayes-pba').value);
        const pb = parseFloat(document.getElementById('bayes-pb').value);

        validateProbability(pa, 'P(A)');
        validateProbability(pba, 'P(B|A)');
        validateProbability(pb, 'P(B)');

        if (pb === 0) {
            throw new Error('P(B) 不能为 0');
        }

        const result = (pa * pba) / pb;
        const percentage = (result * 100).toFixed(2);

        showResult('bayes-result', true, '计算结果',
            `P(A|B) = ${result.toFixed(4)} = ${percentage}%`,
            `计算过程：P(A|B) = ${pa} × ${pba} / ${pb} = ${result.toFixed(4)}<br>
            即后验概率 P(A|B) 为 <span class="highlight">${percentage}%</span>`
        );
    } catch (error) {
        showResult('bayes-result', false, '输入错误', error.message, '');
    }
}

// ==================== 二项分布 ====================
function calculateBinomial() {
    try {
        const n = parseInt(document.getElementById('binom-n').value);
        const k = parseInt(document.getElementById('binom-k').value);
        const p = parseFloat(document.getElementById('binom-p').value);

        validatePositiveInt(n, '试验次数 n');
        validateNonNegativeInt(k, '成功次数 k');
        validateProbability(p, '单次成功概率 p');

        if (k > n) {
            throw new Error('成功次数 k 不能大于试验次数 n');
        }

        const comb = combination(n, k);
        const result = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
        const percentage = (result * 100).toFixed(4);

        showResult('binomial-result', true, '计算结果',
            `P(X=${k}) = ${result.toFixed(6)} = ${percentage}%`,
            `计算过程：<br>
            C(${n}, ${k}) = ${comb}<br>
            p<sup>k</sup> = ${p}<sup>${k}</sup> = ${Math.pow(p, k).toFixed(6)}<br>
            (1-p)<sup>n-k</sup> = ${(1-p).toFixed(4)}<sup>${n-k}</sup> = ${Math.pow(1 - p, n - k).toFixed(6)}<br>
            P(X=${k}) = ${comb} × ${Math.pow(p, k).toFixed(6)} × ${Math.pow(1 - p, n - k).toFixed(6)} = <span class="highlight">${result.toFixed(6)}</span><br>
            即在 ${n} 次试验中恰好成功 ${k} 次的概率为 <span class="highlight">${percentage}%</span>`
        );
    } catch (error) {
        showResult('binomial-result', false, '输入错误', error.message, '');
    }
}

// ==================== 泊松分布 ====================
function calculatePoisson() {
    try {
        const k = parseInt(document.getElementById('poisson-k').value);
        const lambda = parseFloat(document.getElementById('poisson-lambda').value);

        validateNonNegativeInt(k, '事件发生次数 k');

        if (lambda < 0) {
            throw new Error('平均发生率 λ 必须大于等于 0');
        }

        const result = Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
        const percentage = (result * 100).toFixed(4);

        showResult('poisson-result', true, '计算结果',
            `P(X=${k}) = ${result.toFixed(6)} = ${percentage}%`,
            `计算过程：<br>
            e<sup>-λ</sup> = e<sup>-${lambda}</sup> = ${Math.exp(-lambda).toFixed(6)}<br>
            λ<sup>k</sup> = ${lambda}<sup>${k}</sup> = ${Math.pow(lambda, k).toFixed(6)}<br>
            k! = ${k}! = ${factorial(k)}<br>
            P(X=${k}) = ${Math.exp(-lambda).toFixed(6)} × ${Math.pow(lambda, k).toFixed(6)} / ${factorial(k)} = <span class="highlight">${result.toFixed(6)}</span><br>
            即平均发生 ${lambda} 次的事件恰好发生 ${k} 次的概率为 <span class="highlight">${percentage}%</span>`
        );
    } catch (error) {
        showResult('poisson-result', false, '输入错误', error.message, '');
    }
}

// ==================== 正态分布 ====================
function calculateNormal() {
    try {
        const x = parseFloat(document.getElementById('normal-x').value);
        const mu = parseFloat(document.getElementById('normal-mu').value);
        const sigma = parseFloat(document.getElementById('normal-sigma').value);

        if (sigma <= 0) {
            throw new Error('标准差 σ 必须大于 0');
        }

        const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
        const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
        const result = coefficient * Math.exp(exponent);

        showResult('normal-result', true, '计算结果',
            `f(${x}) = ${result.toFixed(6)}`,
            `计算过程：<br>
            μ = ${mu}, σ = ${sigma}<br>
            系数 = 1/(${sigma} × √(2π)) = ${coefficient.toFixed(6)}<br>
            指数 = -(${x} - ${mu})² / (2 × ${sigma}²) = ${exponent.toFixed(4)}<br>
            f(${x}) = ${coefficient.toFixed(6)} × e<sup>${exponent.toFixed(4)}</sup> = <span class="highlight">${result.toFixed(6)}</span><br>
            即在 N(${mu}, ${sigma}²) 分布中，x = ${x} 处的概率密度值为 <span class="highlight">${result.toFixed(6)}</span>`
        );
    } catch (error) {
        showResult('normal-result', false, '输入错误', error.message, '');
    }
}

// ==================== 数学期望 ====================
function addExpectationRow() {
    const table = document.getElementById('expectation-table').querySelector('tbody');
    const row = table.insertRow();
    row.innerHTML = `
        <td><input type="number" class="exp-val" step="0.1" value="0"></td>
        <td><input type="number" class="exp-prob" min="0" max="1" step="0.01" value="0.1"></td>
        <td><button class="remove-row-btn" onclick="removeRow(this)">删除</button></td>
    `;
}

function calculateExpectation() {
    try {
        const valInputs = document.querySelectorAll('.exp-val');
        const probInputs = document.querySelectorAll('.exp-prob');

        if (valInputs.length === 0) {
            throw new Error('请至少添加一行数据');
        }

        const values = [];
        const probs = [];
        let probSum = 0;

        for (let i = 0; i < valInputs.length; i++) {
            const val = parseFloat(valInputs[i].value);
            const prob = parseFloat(probInputs[i].value);

            if (isNaN(val)) throw new Error(`第 ${i + 1} 行的取值无效`);
            if (isNaN(prob) || prob < 0 || prob > 1) {
                throw new Error(`第 ${i + 1} 行的概率必须在 0 到 1 之间`);
            }

            values.push(val);
            probs.push(prob);
            probSum += prob;
        }

        if (Math.abs(probSum - 1) > 0.001) {
            throw new Error(`概率之和必须为 1，当前概率之和为 ${probSum.toFixed(4)}`);
        }

        let expectation = 0;
        let detailHtml = '计算过程：<br>';
        for (let i = 0; i < values.length; i++) {
            const term = values[i] * probs[i];
            expectation += term;
            detailHtml += `x<sub>${i + 1}</sub> × p<sub>${i + 1}</sub> = ${values[i]} × ${probs[i]} = ${term.toFixed(4)}<br>`;
        }

        detailHtml += `<br>E(X) = <span class="highlight">${expectation.toFixed(4)}</span>`;

        showResult('expectation-result', true, '计算结果',
            `E(X) = ${expectation.toFixed(4)}`,
            detailHtml
        );
    } catch (error) {
        showResult('expectation-result', false, '输入错误', error.message, '');
    }
}

// ==================== 方差 ====================
function addVarianceRow() {
    const table = document.getElementById('variance-table').querySelector('tbody');
    const row = table.insertRow();
    row.innerHTML = `
        <td><input type="number" class="var-val" step="0.1" value="0"></td>
        <td><input type="number" class="var-prob" min="0" max="1" step="0.01" value="0.1"></td>
        <td><button class="remove-row-btn" onclick="removeRow(this)">删除</button></td>
    `;
}

function calculateVariance() {
    try {
        const valInputs = document.querySelectorAll('.var-val');
        const probInputs = document.querySelectorAll('.var-prob');

        if (valInputs.length === 0) {
            throw new Error('请至少添加一行数据');
        }

        const values = [];
        const probs = [];
        let probSum = 0;

        for (let i = 0; i < valInputs.length; i++) {
            const val = parseFloat(valInputs[i].value);
            const prob = parseFloat(probInputs[i].value);

            if (isNaN(val)) throw new Error(`第 ${i + 1} 行的取值无效`);
            if (isNaN(prob) || prob < 0 || prob > 1) {
                throw new Error(`第 ${i + 1} 行的概率必须在 0 到 1 之间`);
            }

            values.push(val);
            probs.push(prob);
            probSum += prob;
        }

        if (Math.abs(probSum - 1) > 0.001) {
            throw new Error(`概率之和必须为 1，当前概率之和为 ${probSum.toFixed(4)}`);
        }

        // 计算 E(X)
        let ex = 0;
        for (let i = 0; i < values.length; i++) {
            ex += values[i] * probs[i];
        }

        // 计算 E(X²)
        let ex2 = 0;
        for (let i = 0; i < values.length; i++) {
            ex2 += Math.pow(values[i], 2) * probs[i];
        }

        // D(X) = E(X²) - [E(X)]²
        const variance = ex2 - Math.pow(ex, 2);
        const stdDev = Math.sqrt(variance);

        let detailHtml = '计算过程：<br><br>';
        detailHtml += '第一步：计算 E(X)<br>';
        for (let i = 0; i < values.length; i++) {
            detailHtml += `x<sub>${i + 1}</sub> × p<sub>${i + 1}</sub> = ${values[i]} × ${probs[i]} = ${(values[i] * probs[i]).toFixed(4)}<br>`;
        }
        detailHtml += `E(X) = ${ex.toFixed(4)}<br><br>`;

        detailHtml += '第二步：计算 E(X²)<br>';
        for (let i = 0; i < values.length; i++) {
            detailHtml += `x<sub>${i + 1}</sub>² × p<sub>${i + 1}</sub> = ${Math.pow(values[i], 2).toFixed(4)} × ${probs[i]} = ${(Math.pow(values[i], 2) * probs[i]).toFixed(4)}<br>`;
        }
        detailHtml += `E(X²) = ${ex2.toFixed(4)}<br><br>`;

        detailHtml += `第三步：计算方差<br>`;
        detailHtml += `D(X) = E(X²) - [E(X)]² = ${ex2.toFixed(4)} - ${ex.toFixed(4)}² = ${ex2.toFixed(4)} - ${Math.pow(ex, 2).toFixed(4)}<br>`;
        detailHtml += `D(X) = <span class="highlight">${variance.toFixed(4)}</span><br>`;
        detailHtml += `标准差 σ = √D(X) = <span class="highlight">${stdDev.toFixed(4)}</span>`;

        showResult('variance-result', true, '计算结果',
            `D(X) = ${variance.toFixed(4)}`,
            detailHtml
        );
    } catch (error) {
        showResult('variance-result', false, '输入错误', error.message, '');
    }
}

// ==================== 通用函数 ====================

/**
 * 删除表格行
 */
function removeRow(btn) {
    const row = btn.closest('tr');
    const tbody = row.closest('tbody');
    if (tbody.rows.length > 1) {
        row.remove();
    } else {
        alert('至少需要保留一行数据');
    }
}

// ==================== 键盘事件支持 ====================
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const activePanel = document.querySelector('.formula-panel.active');
        if (activePanel) {
            const calcBtn = activePanel.querySelector('.calc-btn');
            if (calcBtn) {
                calcBtn.click();
            }
        }
    }
});
