/**
 * 过滤对象中的空值（null、undefined、空字符串）
 * 保留：0、false、空数组、空对象
 */
export function filterEmptyValues(obj: any): any {
  // FormData 特殊处理
  if (obj instanceof FormData) {
    const newFormData = new FormData();
    obj.forEach((value, key) => {
      if (value !== null && value !== undefined)
        newFormData.append(key, value);
    });
    return newFormData;
  }

  // 其他特殊对象类型直接返回（File、Blob、Date 等）
  if (obj instanceof File || obj instanceof Blob || obj instanceof Date)
    return obj;

  if (!obj || typeof obj !== 'object')
    return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined)
      result[key] = typeof value === 'object' ? filterEmptyValues(value) : value;
  }

  return result;
}
