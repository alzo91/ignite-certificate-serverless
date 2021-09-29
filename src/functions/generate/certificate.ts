import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import dayjs from "dayjs";

import compile from "src/utils/compileHTML";
import transformToPdf from "src/utils/transformToPdf";
import { UsersRepository } from "src/repositories/implementations/UsersRepository";

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { grade, id, name } = JSON.parse(event.body) as ICreateCertificate;

  const userRepository = new UsersRepository();

  const user = await userRepository.findById({ id });

  if (!user) await userRepository.create({ id, name, grade });

  console.log(">>> Generate/certificate.handle checked user!");

  const content_html = await compile({
    id,
    name,
    grade,
    date: dayjs().format("DD/MM/YYYY"),
  });

  const pdf_buffer = await transformToPdf(content_html);

  console.log(">>> Generate/certificate.handle will save PDF to s3");

  const s3 = new S3({ region: process.env.AWS_BUCKET_REGION });

  const Bucket = `${process.env.AWS_BUCKET}/certificates`;

  const to_date = dayjs().format("YYYY-MM-DD");

  const key_name = `${id}-${to_date}.pdf`;

  console.log(">>> Generate/certificate.handle is saving to s3 now!!!");

  await s3
    .putObject({
      Bucket,
      Key: key_name,
      Body: pdf_buffer,
      ACL: "public-read",
      ContentType: "application/pdf",
    })
    .promise();

  console.log(">>> Generate/certificate.handle is creating url to PDF!");

  const image_url = `${process.env.AWS_S3_URL}certificates/${key_name}`;

  console.log(">>> Generate/certificate.handle is saving the user found!!!");

  userRepository.update({ id, grade, certificate: image_url, name });

  console.log(">>> Generate/certificate.handle will return to url with PDF!");

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Certificate was created",
      url: image_url,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
