import { memo } from 'react';

/**
 * Responsive <picture> with AVIF + WebP sources and native lazy loading.
 * Files: /images/<name>.avif|webp (full) and /images/<name>-sm.avif|webp (480w).
 */
function Picture({ name, alt, width = 900, height = 675, full = 900, priority = false, sizes = '(min-width: 900px) 50vw, 100vw', className = '' }) {
  const base = `/images/${name}`;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}-sm.avif 480w, ${base}.avif ${full}w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${base}-sm.webp 480w, ${base}.webp ${full}w`} sizes={sizes} />
      <img
        className={className}
        src={`${base}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}

export default memo(Picture);
