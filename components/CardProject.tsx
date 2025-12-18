import Icons from "./Icons";
import Link from "next/link";
import Image from "next/image";
import { ProjectDataType } from '@/types/project';

const CardProject = ({ data }: ProjectDataType) => {
    const { 
        slug,
        title,
        description,
        category,
        image
    } = data || {};

    return (
        <div
            className="card-project radius18"
            aria-label="project details"
          
        >
            {image &&
                <Image
                    src={image}
                    alt={`Image of ${title}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                />
            }

            <div className="card-project-content-absolute">
                <div className="card-project-content">
                    {title && <h2 className="heading">{title}</h2>}
                    {description && <p className="text">{description}</p>}
                </div>
            </div>

          
        </div>
    )
}

export default CardProject;