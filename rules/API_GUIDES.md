  ### API Response Format

  ```json
  {
    "code": 200,
    "success": true/false,
    "message": "Error_Code_Here" | null,
    "data": <T>,
    "metaData": { "total": N, "page": N, "pageSize": N } | null
  }
  ```
  
  ### API-ready architecture (mock now, real API later)
  > **Rule:** Never embed static data directly in components or constants files as a substitute 
