import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  Truck,
  PackageCheck,
} from "lucide-react";
import useOrderStore from "../store/orderStore";

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: "#f59e0b",
    bg: "#fef3c7",
    label: "Payment Pending",
  },
  CONFIRMED: {
    icon: CheckCircle,
    color: "#3b82f6",
    bg: "#dbeafe",
    label: "Order Confirmed",
  },
  PREPARING: {
    icon: Clock,
    color: "#a78bfa",
    bg: "#f3e8ff",
    label: "Preparing",
  },
  OUT_FOR_DELIVERY: {
    icon: Truck,
    color: "#f97316",
    bg: "#fed7aa",
    label: "Out for Delivery",
  },
  DELIVERED: {
    icon: PackageCheck,
    color: "#0D9E7E",
    bg: "#E8F8F3",
    label: "Delivered",
  },
  CANCELLED: {
    icon: AlertCircle,
    color: "#ef4444",
    bg: "#fee2e2",
    label: "Cancelled",
  },
  REFUNDED: {
    icon: AlertCircle,
    color: "#9CA3AF",
    bg: "#f3f4f6",
    label: "Refunded",
  },
};

const timelineSteps = [
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, fetchOrderDetail, cancelOrderAction } = useOrderStore();
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    fetchOrderDetail(orderId);
  }, [orderId]);

  const handleCancel = async () => {
    setIsCanceling(true);
    const success = await cancelOrderAction(orderId);
    if (success) {
      fetchOrderDetail(orderId);
    }
    setIsCanceling(false);
    setCancelConfirm(false);
  };

  if (!currentOrder) {
    return (
      <div
        style={{
          paddingTop: "4rem",
          paddingBottom: "7rem",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid #E8F8F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={20} style={{ color: "#033428" }} />
          </button>
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "1rem",
              marginBottom: "1rem",
              animation: "pulse 2s infinite",
              border: "1px solid #E5E7EB",
              height: "100px",
            }}
          />
        ))}
      </div>
    );
  }

  const config = statusConfig[currentOrder.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const canCancel =
    currentOrder.status === "PENDING" || currentOrder.status === "CONFIRMED";

  return (
    <div style={{
        paddingTop: "4rem",
        paddingBottom: "7rem",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: "4rem",
          backgroundColor: "rgba(249, 250, 251, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E8F8F3",
          zIndex: 10,
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "white",
            border: "1px solid #E8F8F3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <ChevronLeft size={20} style={{ color: "#033428" }} />
        </button>
        <div>
          <h1
            style={{
              fontSize: "1rem",
              fontWeight: "900",
              color: "#033428",
              margin: 0,
            }}
          >
            Order Details
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>
            #{currentOrder.orderNumber}
          </p>
        </div>
      </div>

      <div style={{ padding: "1rem" }}>
        {/* Status Hero */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1.5rem",
            padding: "2rem 1rem",
            border: "1px solid #E8F8F3",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "1rem",
              backgroundColor: config.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <StatusIcon size={32} style={{ color: config.color }} />
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "900",
              color: "#033428",
              margin: 0,
            }}
          >
            {config.label}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#9CA3AF",
              marginTop: "0.5rem",
            }}
          >
            {currentOrder.status === "DELIVERED"
              ? "Your order has been delivered"
              : currentOrder.status === "OUT_FOR_DELIVERY"
                ? "Your order is on the way!"
                : "We are preparing your order"}
          </p>
        </div>

        {/* Timeline */}
        {timelineSteps.includes(currentOrder.status) && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              border: "1px solid #E8F8F3",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "1.25rem",
                top: "1.5rem",
                bottom: "1.5rem",
                width: "2px",
                backgroundColor: "#E8F8F3",
              }}
            />

            {timelineSteps.map((step, idx) => {
              const isCompleted =
                timelineSteps.indexOf(currentOrder.status) >= idx;
              const isCurrent = currentOrder.status === step;

              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom:
                      idx !== timelineSteps.length - 1 ? "1.5rem" : 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isCompleted ? "#0D9E7E" : "#E8F8F3",
                      backgroundColor: isCompleted ? "#0D9E7E" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {isCompleted && (
                      <CheckCircle size={24} style={{ color: "white" }} />
                    )}
                    {isCurrent && (
                      <div
                        style={{
                          position: "absolute",
                          inset: "-8px",
                          borderRadius: "50%",
                          border: "2px solid #0D9E7E",
                          opacity: 0.3,
                          animation: "pulse 2s infinite",
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "700",
                        color: "#033428",
                        margin: 0,
                      }}
                    >
                      {step.replace(/_/g, " ")}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#9CA3AF",
                        marginTop: "0.25rem",
                        margin: 0,
                      }}
                    >
                      {isCompleted && currentOrder.timeline?.[step]
                        ? new Date(
                            currentOrder.timeline[step],
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Items */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1.5rem",
            padding: "1.5rem",
            border: "1px solid #E8F8F3",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: "900",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
              margin: 0,
            }}
          >
            Items Ordered
          </p>

          {currentOrder.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "1rem",
                paddingBottom:
                  idx !== currentOrder.items.length - 1 ? "1rem" : 0,
                borderBottom:
                  idx !== currentOrder.items.length - 1
                    ? "1px solid #F3F7F4"
                    : "none",
              }}
            >
              {item.product?.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product?.name}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "0.75rem",
                    backgroundColor: "#E8F8F3",
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    color: "#033428",
                    margin: 0,
                  }}
                >
                  {item.product?.name}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#9CA3AF",
                    fontWeight: "500",
                    margin: "0.25rem 0 0 0",
                  }}
                >
                  {item.quantity} × ₹{item.unitPrice}
                </p>
              </div>

              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  color: "#033428",
                  margin: 0,
                }}
              >
                ₹{item.itemTotal}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        {currentOrder.deliveryAddress && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              border: "1px solid #E8F8F3",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <MapPin size={16} style={{ color: "#0D9E7E" }} />
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "900",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                Delivery Address
              </p>
            </div>

            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: "900",
                backgroundColor: "#E8F8F3",
                color: "#0D9E7E",
                padding: "0.25rem 0.5rem",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              {currentOrder.deliveryAddress.label}
            </span>

            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#033428",
                margin: "0 0 0.25rem 0",
              }}
            >
              {currentOrder.deliveryAddress.line1}
              {currentOrder.deliveryAddress.line2 &&
                `, ${currentOrder.deliveryAddress.line2}`}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#9CA3AF", margin: 0 }}>
              {currentOrder.deliveryAddress.city},{" "}
              {currentOrder.deliveryAddress.state}{" "}
              {currentOrder.deliveryAddress.pincode}
            </p>
          </div>
        )}

        {/* Payment Summary */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1.5rem",
            padding: "1.5rem",
            border: "1px solid #E8F8F3",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: "900",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
              margin: 0,
            }}
          >
            Payment Summary
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "#9CA3AF" }}>Subtotal</span>
              <span style={{ fontWeight: "600", color: "#033428" }}>
                ₹{currentOrder.subtotal}
              </span>
            </div>

            {currentOrder.totalSavings > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ color: "#9CA3AF" }}>Savings</span>
                <span style={{ fontWeight: "600", color: "#0D9E7E" }}>
                  - ₹{currentOrder.totalSavings}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
              }}
            >
              <span style={{ color: "#9CA3AF" }}>Delivery</span>
              <span
                style={{
                  fontWeight: "600",
                  color: currentOrder.deliveryFee === 0 ? "#0D9E7E" : "#033428",
                }}
              >
                {currentOrder.deliveryFee === 0
                  ? "FREE"
                  : `₹${currentOrder.deliveryFee}`}
              </span>
            </div>

            <div
              style={{
                borderTop: "1px solid #E8F8F3",
                paddingTop: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
                fontWeight: "700",
                color: "#033428",
              }}
            >
              <span>Total</span>
              <span>₹{currentOrder.totalAmount}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              backgroundColor:
                currentOrder.paymentMethod === "COD" ? "#fef3c7" : "#dbeafe",
              border:
                currentOrder.paymentMethod === "COD"
                  ? "1px solid #fcd34d"
                  : "1px solid #bfdbfe",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "900",
                color:
                  currentOrder.paymentMethod === "COD" ? "#b45309" : "#1e40af",
                textTransform: "uppercase",
              }}
            >
              {currentOrder.paymentMethod === "COD" ? "💵" : "💳"}{" "}
              {currentOrder.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.75rem",
                fontWeight: "700",
                color:
                  currentOrder.paymentStatus === "PAID"
                    ? "#0D9E7E"
                    : currentOrder.paymentStatus === "PENDING"
                      ? "#f59e0b"
                      : "#ef4444",
                textTransform: "uppercase",
              }}
            >
              {currentOrder.paymentStatus}
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        {canCancel && (
          <div>
            {!cancelConfirm ? (
              <button
                onClick={() => setCancelConfirm(true)}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  backgroundColor: "white",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  borderRadius: "1.5rem",
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 200ms",
                }}
              >
                Cancel Order
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "1.5rem",
                  padding: "1rem",
                  border: "1px solid #E8F8F3",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#033428",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  Cancel this order?
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => setCancelConfirm(false)}
                    disabled={isCanceling}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#E8F8F3",
                      color: "#0D9E7E",
                      border: "none",
                      borderRadius: "0.75rem",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Keep It
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isCanceling}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "0.75rem",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      cursor: isCanceling ? "not-allowed" : "pointer",
                      opacity: isCanceling ? 0.5 : 1,
                    }}
                  >
                    {isCanceling ? "Canceling..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
