interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    cornerRadius?: number;
    baseStrength?: number;
    extraBlur?: number;
    softness?: number;
    invert?: number;
    edgeContrast?: number;
    shadowContrast?: number;
    refractionContrast?: number;
    extraContrast?: number;
    reflectionPresence?: number;
    bevelSaturation?: number;
    edgeBrightness?: number;
    brightness?: number;
    zTransform?: number;
}

export const GlassContainer = ({ 
    children, 
    className,
    cornerRadius = 50,
    baseStrength = 10,
    extraBlur = 0,
    softness = 10,
    invert = 0,
    edgeContrast = 2,
    shadowContrast = 2,
    refractionContrast = 1,
    extraContrast = 1,
    reflectionPresence = 1,
    bevelSaturation = 1,
    edgeBrightness = 1,
    brightness = 1,
    zTransform = 0
}: GlassContainerProps): JSX.Element => {
    
    // Logic-driven variable calculations (previously in CSS)
    const totalStrength = baseStrength + extraBlur;
    const edgeWidth = 0.3 + (softness * 0.1);
    const embossWidth = softness * 0.38;
    const refractionWidth = softness * 0.3;
    const innerShadowPadding = embossWidth / 3;
    const blurRadius = cornerRadius - (embossWidth + refractionWidth);
    const blurMargin = embossWidth + refractionWidth;
    const blendLayersBlur = (softness * 0.2) + (extraBlur * 0.2);
    const blendEdgeBlur = edgeWidth * 0.4;
    const invertPercent = `${invert * 100}%`;

    return (
        <div className={`relative overflow-visible pointer-events-none [transform:translateZ(0)] ${className || ''}`}>
            {/* Background Invert Layer */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 20 + zTransform,
                    borderRadius: `${cornerRadius}px`,
                    backdropFilter: `invert(${invertPercent})`,
                    WebkitBackdropFilter: `invert(${invertPercent})`,
                    willChange: 'backdrop-filter'
                }}
            />

            {/* GlassContent - Container for children */}
            <div 
                className="relative block overflow-hidden pointer-events-auto w-full h-full"
                style={{ 
                    zIndex: 100 + zTransform,
                    borderRadius: `${cornerRadius}px` 
                }}
            >
                {children}
            </div>

            {/* GlassMaterial - Visual layers for the glass effect */}
            <div 
                className="absolute inset-0 overflow-visible pointer-events-none"
                style={{ zIndex: 1 + zTransform }}
            >
                
                {/* Tint/Overlay Layer */}
                <div 
                    className="absolute inset-0 overflow-hidden bg-[rgba(0,0,0,0.171)]"
                    style={{ 
                        zIndex: 3 + zTransform,
                        borderRadius: `${cornerRadius}px` 
                    }}
                />

                {/* Border Gradient Layer */}
                <div 
                    className="absolute inset-0"
                    style={{
                        zIndex: 11 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        padding: '1px',
                        background: 'linear-gradient(8deg, hsl(0deg 0% 0% / 38%) 0%, hsl(0deg 0% 0% / 0%) 50%)',
                        backdropFilter: 'blur(11px) brightness(1.5) saturate(0.8)',
                        WebkitBackdropFilter: 'blur(11px) brightness(1.5) saturate(0.8)',
                        WebkitMask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        mask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        WebkitMaskComposite: 'destination-out',
                        maskComposite: 'exclude',
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Edge Reflection */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 4 + zTransform,
                        margin: `-${totalStrength}px`,
                        borderRadius: `${cornerRadius + totalStrength}px`,
                        backdropFilter: `blur(${totalStrength}px) brightness(${reflectionPresence}) saturate(${reflectionPresence})`,
                        WebkitBackdropFilter: `blur(${totalStrength}px) brightness(${reflectionPresence}) saturate(${reflectionPresence})`,
                        padding: `${edgeWidth}px`,
                        border: `${totalStrength}px solid transparent`,
                        WebkitMask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        mask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        WebkitMaskComposite: 'destination-out',
                        maskComposite: 'exclude',
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Emboss Reflection */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 2 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        backdropFilter: `blur(${totalStrength * 1.5}px) invert(0.25) brightness(${edgeBrightness}) saturate(${bevelSaturation}) contrast(${edgeContrast})`,
                        WebkitBackdropFilter: `blur(${totalStrength * 1.5}px) invert(0.25) brightness(${edgeBrightness}) saturate(${bevelSaturation}) contrast(${edgeContrast})`,
                        padding: `${embossWidth}px`,
                        WebkitMask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        mask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        WebkitMaskComposite: 'destination-out',
                        maskComposite: 'exclude',
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Inner Shadow */}
                <div 
                    className="absolute inset-0 overflow-hidden opacity-50"
                    style={{
                        zIndex: 4 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        backdropFilter: `blur(${totalStrength * 5}px) invert(0.25) brightness(${edgeBrightness}) saturate(${bevelSaturation}) contrast(${shadowContrast})`,
                        WebkitBackdropFilter: `blur(${totalStrength * 5}px) invert(0.25) brightness(${edgeBrightness}) saturate(${bevelSaturation}) contrast(${shadowContrast})`,
                        padding: `${innerShadowPadding}px`,
                        boxShadow: 'inset -20px 18px 20px 0px #00000059',
                        WebkitMask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        mask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        WebkitMaskComposite: 'destination-out',
                        maskComposite: 'exclude',
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Refraction */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 2 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        backdropFilter: `invert(0.1) brightness(1) contrast(${refractionContrast})`,
                        WebkitBackdropFilter: `invert(0.1) brightness(1) contrast(${refractionContrast})`,
                        padding: `${refractionWidth}px`,
                        border: `${embossWidth}px solid transparent`,
                        WebkitMask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        mask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        WebkitMaskComposite: 'destination-out',
                        maskComposite: 'exclude',
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Glass Blur */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 2 + zTransform,
                        backdropFilter: `blur(${extraBlur}px)`,
                        WebkitBackdropFilter: `blur(${extraBlur}px)`,
                        borderRadius: `${blurRadius}px`,
                        margin: `${blurMargin}px`,
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Blend Layers */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 3 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        backdropFilter: `blur(${blendLayersBlur}px)`,
                        WebkitBackdropFilter: `blur(${blendLayersBlur}px)`,
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Blend Shadow */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 5 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        backdropFilter: 'blur(3px)',
                        WebkitBackdropFilter: 'blur(3px)',
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Blend Edge */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 8 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        backdropFilter: `blur(${blendEdgeBlur}px) contrast(${extraContrast})`,
                        WebkitBackdropFilter: `blur(${blendEdgeBlur}px) contrast(${extraContrast})`,
                        willChange: 'backdrop-filter'
                    }}
                />

                {/* Highlight */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        zIndex: 12 + zTransform,
                        borderRadius: `${cornerRadius}px`,
                        padding: '1px',
                        backdropFilter: `brightness(${brightness})`,
                        WebkitBackdropFilter: `brightness(${brightness})`,
                        WebkitMask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        mask: 'linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0) content-box',
                        WebkitMaskComposite: 'source-over',
                        maskComposite: 'overlay, exclude' as any,
                        willChange: 'backdrop-filter'
                    }}
                />
            </div>
        </div>
    );
};

