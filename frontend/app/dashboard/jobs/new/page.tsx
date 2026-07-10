import JobForm from "../../components/JobForm";

export default function NewJobPage() {
  return (
    <div>
      <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#18181b", marginBottom: "24px" }}>
        Create Job
      </h1>
      <JobForm />
    </div>
  );
}
