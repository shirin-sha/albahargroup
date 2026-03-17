import "@/styles/multicolumn.css";
import { ServiceSectionType } from "@/types/serviceSection";
import CardService from "../CardService";
import NotFoundMsg from "../NotFoundMsg";
import { getDb } from "@/libs/mongodb";
import { Service } from "@/libs/models/service";

const Services = async ({
    wrapperCls,
    container,
}: ServiceSectionType) => {
    const db = await getDb();
    const collection = db.collection<Service>("services");
    const serviceList = await collection
        .find({ enabled: { $ne: false } } as any)
        .sort({ created_at: -1 })
        .toArray();

    if(serviceList.length == 0) {
        return <NotFoundMsg message="No services found" />;
    }

    return (
        <div className={`multicolumn multicolumn-page ${wrapperCls}`}>
            <div className={container}>
                    <div className="multicolumn-inner">
                        <div className="grid grid-cols-12 md:gap-1 product-grid">
                            {serviceList.map((service: any, index) => (
                                <div 
                                    className="xl:col-span-4 md:col-span-6 col-span-12" 
                                    data-aos="fade-up"
                                    key={`card-service-${index}`}
                                >                                    
                                    <CardService data={{ ...service, id: service._id ? String(service._id) : service.id }} />
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Services;