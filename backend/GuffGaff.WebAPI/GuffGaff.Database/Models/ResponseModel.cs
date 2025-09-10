namespace GuffGaff.Database.Models
{
    public class ResponseModel
    {
        public string _message { get; set; }
        public bool _isSuccess { get; set; }

        public ResponseModel(bool isSuccess, string message = "Sucessful")
        {
            _message = message;
            _isSuccess = isSuccess;
        }
    }

    public class ResponseModelTask<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }

        public ResponseModelTask(T data, string message = "Success")
        {
            Data = data;
            Message = message;
        }
    }

}
